import json
import math
from bs4 import BeautifulSoup
import requests
from functools import cmp_to_key

from source.main.model import (
    Imaga_Chapter,
    Comments,
    CommentDiary,
    LikesComment,
    ServerMode,
    Users,
    Profiles,
    List_Manga,
    List_Chapter,
    Manga_Update,
    List_Server,
    List_Chapter_Novel,
)
from source.validate_form import (
    RegisterForm,
    LoginForm,
    ChangeProfile,
    SettingPasswordForm,
    ForgotPasswordForm,
    CommentsForm,
)

from flask_login import (
    LoginManager,
    login_user,
    login_required,
    logout_user,
    current_user,
)
from flask import Flask, request, jsonify, send_from_directory, url_for, session
from flask_caching import Cache
from flask_cors import CORS
from flask_mail import *

from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from itsdangerous import URLSafeTimedSerializer

from sqlalchemy import JSON, cast, FLOAT, func, desc, asc
from sqlalchemy.types import Integer
from datetime import datetime, timedelta

from urllib.parse import unquote
from threading import Thread
import imgbbpy, os

from ip2geotools.databases.noncommercial import DbIpCity
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_jwt_extended import JWTManager
from source import db, app, mail


def convert_time(time):
    time_now = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
    register_date = datetime.strptime(time, "%H:%M:%S %d-%m-%Y")
    current_date = datetime.strptime(time_now, "%H:%M:%S %d-%m-%Y")

    participation_time = current_date - register_date
    if participation_time < timedelta(minutes=1):
        time_in_seconds = participation_time.seconds
        time = f"{time_in_seconds} seconds ago"
    elif participation_time < timedelta(hours=1):
        time_in_minutes = participation_time.seconds // 60
        time = f"{time_in_minutes} minute ago"
    elif participation_time < timedelta(days=1):
        time_in_hours = participation_time.seconds // 3600
        time = f"{time_in_hours} hours ago"
    elif participation_time < timedelta(days=2):
        time = f"Yesterday, " + register_date.strftime("%I:%M %p")
    else:
        time = register_date.strftime("%b %d, %I:%M %p")
    return time


def send_email(msg):
    with app.app_context():
        mail.send(msg)


def list_chapter(localhost, id_manga, path_segment_manga, type):
    try:
        querys = List_Chapter.query.filter(
            List_Chapter.id_manga.ilike(f"%{id_manga}%")
        ).all()

        if not querys:
            return []

        ListChapters = []

        for query in querys:
            path_segment_chapter = query.path_segment_chapter
            match = re.search(r"chapter-(\d+)", path_segment_chapter)
            if match:
                chapter_number = int(match.group(1))
            else:
                continue

            chapter_name = query.title_chapter.split("/")[-1]
            if chapter_name == "":
                chapter_name = query.title_chapter.split("/")[-2]
            chapter_name = chapter_name.replace(".html", "")

            path = f"{localhost}/r{type}/{path_segment_manga}/{path_segment_chapter}"

            chapter = {
                "url": path,
                "id_chapter": path_segment_chapter,
                "chapter_number": chapter_number,
            }
            ListChapters.append(chapter)

        ListChapters.sort(key=lambda x: x["chapter_number"])

        return ListChapters
    except Exception as e:
        print(f"Error in list_chapter: {e}")
        return []


def list_chapter_novel(localhost, id_manga, path_segment_manga, type):

    querys = List_Chapter_Novel.query.filter_by(id_manga=id_manga).all()

    sorted_querys = sorted(
        querys,
        key=lambda x: float(x.id_chapter.split("/")[-1].replace("chapter_", "")),
        reverse=True,
    )
    if querys is None:
        return jsonify({"message": "Not found chapter"}), 404
    # print("______VAO_PHAN_DEBUG_CHAPTER______")
    ListChapterNovels = []
    chapterNameNumber = 0
    for query in sorted_querys:
        itemChapter = {}
        chapterNameNumber = chapterNameNumber + 1
        print("id_chapter", query.id_manga)
        path_segment_chapter = split_link(query.id_chapter)
        path = f"{localhost}/{type}/{path_segment_manga}/{path_segment_chapter}"
        # print(path)
        itemChapter[f"{chapterNameNumber}"] = path
        ListChapterNovels.append(path)

    return ListChapterNovels


def get_comments(path_segment_manga):
    def get_comment_data(comment):
        like_count = LikesComment.query.filter_by(
            id_comment=comment.id_comment, status="like"
        ).count()
        profile = Profiles.query.filter_by(id_user=comment.id_user).first()
        return {
            "id_comment": comment.id_comment,
            "id_user": comment.id_user,
            "name_user": profile.name_user,
            "avatar_user": profile.avatar_user,
            "content": comment.content,
            "chapter": comment.path_segment_chapter,
            "time_comment": convert_time(comment.time_comment),
            "likes": like_count,
            "is_comment_reply": comment.is_comment_reply,
            "is_edited_comment": comment.is_edited_comment,
            "replies_content": get_replies(comment.id_comment),
            "reply": len(get_replies(comment.id_comment)),
        }

    def get_replies(parent_comment_id):
        replies = (
            Comments.query.filter_by(reply_id_comment=parent_comment_id)
            .order_by(
                func.STR_TO_DATE(Comments.time_comment, "%H:%i:%S %d-%m-%Y").desc()
            )
            .all()
        )

        reply_data = []
        for reply in replies:
            reply_data.append(get_comment_data(reply))
        return reply_data

    comments = (
        Comments.query.filter(
            Comments.path_segment_manga.ilike(f"%{path_segment_manga}%")
        )
        .order_by(func.STR_TO_DATE(Comments.time_comment, "%H:%i:%S %d-%m-%Y").desc())
        .all()
    )

    comments_info = []
    for comment in comments:
        if comment.is_comment_reply == False:
            comments_info.append(get_comment_data(comment))

    if not comments_info:
        return jsonify({"data": [], "message": "No data available"})
    return jsonify({"status": 200, "data": comments_info}), 200


def delete_reply_comment(comment):
    reply_comments = Comments.query.filter_by(reply_id_comment=comment.id_comment).all()
    for reply_comment in reply_comments:
        delete_reply_comment(reply_comment)

        comment_diary = CommentDiary(
            id_comment=reply_comment.id_comment,
            content=reply_comment.content,
            comment_type="delete",
            time_comment=reply_comment.time_comment,
        )
        db.session.add(comment_diary)
        db.session.delete(reply_comment)
        db.session.commit()


def update_participation_time(id_user, participation_time):
    profile = Profiles.query.filter_by(id_user=id_user).first()
    profile.participation_time = participation_time
    db.session.commit()


def split_join(url):
    url = url.split("/")
    url = "/".join(url[:3])
    return url


def split_link(url):
    chapter = url.split("/")[-1]
    return chapter


def make_link(localhost, path):
    url = f"{localhost}{path}"
    return url


def conver_url(url):
    if url.endswith(".html"):
        result = url.split("/")[-1].replace(".html", "")
    elif url.endswith("/"):
        result = url.split("/")[-2]
    elif url.endswith("/all-pages"):
        result = url.split("/")[-2]
    else:
        result = url.split("/")[-1]
    result = unquote(result).replace("/", "")
    return result


def get_time_diff(then, now):
    duration = now - then
    duration_in_s = duration.total_seconds()
    time = ""
    if duration_in_s > 60:
        minutes = divmod(duration_in_s, 60)[0]
        if minutes > 60:
            hours = divmod(duration_in_s, 3600)[0]
            if hours > 24:
                days = divmod(duration_in_s, 86400)[0]
                if days > 365:
                    years = divmod(duration_in_s, 31536000)[0]
                    time = f"{years} years"
                else:
                    time = f"{days} days"
            else:
                time = f"{hours} hours"
        else:
            time = f"{minutes} minutes"
    else:
        time = "%.2ss" % (duration_in_s)

    return time


def get_ip():
    if request.environ.get("HTTP_X_FORWARDED_FOR") is None:
        return request.environ["REMOTE_ADDR"]
    else:
        return request.environ["HTTP_X_FORWARDED_FOR"]


def get_location():
    ip_address = get_ip()

    ip_location = DbIpCity.get(ip_address=ip_address, api_key="free")
    information = {
        "ip": ip_address,
        "city": ip_location.city,
        "country": ip_location.country,
    }

    return information


def convert_title_manga(link):
    link = str(link)
    path = link.split("/")[-1]
    return " ".join(path.split("_"))


def check_r18(data):
    r18_genre = [
        "Mature",
        "Smut",
        "Harem",
        "Josei",
        "Seinen",
        "Cheating",
        "Ecchi",
        "Yuri",
        "Shoujo Ai",
        "Crossdressing",
        "Shounen Ai",
        "Horror",
        "I Want To Do All Sorts Of Things With Those Plump Melons!",
        "Ataerareta Skill",
        "sex",
        "Gender Bender",
        "Senpai To Douseichuu",
        "Bishounen (Kaibara Shijimi)",
        "Paranoia Cage",
        "Tou No Kanri O Shite Miyou",
        "Kininaru Danshi Ni ○○ Suru On'nanoko",
        "Human Use",
        "Gal☆Clea!",
        "Nyotaika Plus Kanojo",
        "Waga Tousou - Imouto No Tame Nara Sekai O Shukusei Shite Mo Ii Yo Ne!",
        "Mono-Eye",
    ]
    for genre in r18_genre:
        if genre in data:
            return True
    return False


def web_server_mode_status(id_user):
    user = Users.query.get_or_404(id_user)
    status = user.web_reading_mode_status
    return status


def r18_mode_status():
    return session.get("r18")


def r18_server_status():
    mode = ServerMode.query.filter_by(mode_name="r18").first()
    status = mode.status
    return status


# Check the existence of manga in database
def check_manga(path_segment_manga):
    manga = (
        db.session.query(List_Manga)
        .filter(List_Manga.path_segment_manga == path_segment_manga)
        .first()
    )
    return manga == None


# Check the existence of chapter in database
def check_image_chapter(path_segment_manga, path_segment_chapter):
    path_segment = f"{path_segment_manga}-{path_segment_chapter}"
    chapter = (
        db.session.query(Imaga_Chapter)
        .filter(Imaga_Chapter.path_segment == path_segment)
        .first()
    )
    return chapter == None


def check_chapter(id_chapter):
    chapter = (
        db.session.query(List_Chapter)
        .filter(List_Chapter.id_chapter == id_chapter)
        .first()
    )
    return chapter == None


def insertMangaIntoTable(
    ID_Manga,
    SoLuongView,
    Rate,
    DescriptManga,
    LinkImagePoster_linkgoc,
    Link_Detail_Manga,
    ListChapter,
    Tac_Gia,
    ListCategories,
    Status,
    Title_Manga,
    id_Server,
    LinkImagePoster_link_Upload,
):

    path_segment_manga = conver_url(ID_Manga)
    manga = List_Manga(
        id_manga=ID_Manga,
        path_segment_manga=path_segment_manga,
        title_manga=Title_Manga,
        descript_manga=DescriptManga,
        poster_upload=LinkImagePoster_link_Upload,
        poster_original=LinkImagePoster_linkgoc,
        detail_manga=Link_Detail_Manga,
        categories=ListCategories,
        chapters=ListChapter,
        rate=Rate,
        views_original=SoLuongView,
        status=Status,
        author=Tac_Gia,
        id_server=id_Server,
    )

    manga_update = Manga_Update(
        id_manga=ID_Manga,
        title_manga=Title_Manga,
        id_chapter=None,
        title_chapter=None,
        path_segment_manga=path_segment_manga,
        path_segment_chapter=None,
        time_release=datetime.now().strftime("%Y-%m-%d"),
        poster=LinkImagePoster_linkgoc,
        categories=ListCategories,
        rate=Rate,
        views_week=0,
        views_month=0,
        views=0,
    )
    db.session.add(manga)
    db.session.add(manga_update)
    db.session.commit()


def insertListChapter(id_chapter, title_chapter, path_segment_chapter, id_manga):
    chapter = List_Chapter(
        id_chapter=id_chapter,
        title_chapter=title_chapter,
        path_segment_chapter=path_segment_chapter,
        id_manga=id_manga,
        time_release=datetime.now().strftime("%Y-%m-%d"),
    )
    db.session.add(chapter)
    db.session.commit()


def insertImageChapter(
    path_segment, id_chapter, image_chapter_upload, image_chapter_original
):
    image_chapter = Imaga_Chapter(
        path_segment=path_segment,
        id_chapter=id_chapter,
        image_chapter_upload=image_chapter_upload,
        image_chapter_original=image_chapter_original,
    )

    db.session.add(image_chapter)
    db.session.commit()


def separate_page(list_manga, page, type):
    if type == "manga":
        limit = 4
    else:
        limit = 10
    mangas = []
    page_info = []
    for index in range(page * limit - limit, page * limit):
        mangas.append(list_manga[index])
    page_info.append({"page": page})
    page_info.append({"total_page": math.ceil(len(list_manga) / limit) - 1})
    result = {"list_manga": mangas, "page_info": page_info}

    return result


def get_id_server(index):
    return List_Server.query.filter_by(index=index).first().name_server


def get_username_from_email(email):
    return email.split("@")[0]


def make_title(text, id):
    if not text:
        raise ValueError("Text is required.")
    if not id.startswith("manga-"):
        raise ValueError("ID must start with 'manga-'")

    name = text.lower().replace(" ", "-")
    id_manga = id.replace("manga-", "")
    return f"{name}-{id_manga}"


def format_date(date_str):
    try:
        date_obj = datetime.strptime(date_str, "%b %d, %Y %I:%M %p")

        formatted_date = date_obj.strftime("%d/%m/%Y")

        return formatted_date
    except Exception as e:
        return f"Error: {str(e)}"
