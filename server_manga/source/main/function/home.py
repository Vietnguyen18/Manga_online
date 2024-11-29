from flask import redirect, request, jsonify
from wtforms import SubmitField
from datetime import datetime, timedelta
from source.validate_form import *

from source.main.model import *
import random
import mysql.connector
from email.message import EmailMessage
from source import db, mail, app, secret, login_manager, cache
import smtplib
import flask
from source.send_mail import *
import json
from urllib.request import urlopen
from source.extend import *
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    get_jwt_identity,
)
from sqlalchemy import or_
import math
import re
from source.main.function.middleware import *


# get all news
def get_news():
    page = request.args.get("page", default=1)
    number_item = 0
    try:
        news = Anime_Manga_News.query.all()
        if news is None:
            return jsonify({"message": "News not found"}), 404
        localhost = split_join(request.url)
        limit = 5
        total_pape = math.ceil(len(news) / limit)
        offset = (int(page) - 1) * limit
        current_time = datetime.now()
        time_threshold = current_time - timedelta(hours=12)

        list_new = (
            Anime_Manga_News.query.filter(Anime_Manga_News.time_news >= time_threshold)
            .order_by(Anime_Manga_News.time_news.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )
        results = []
        for new in list_new:
            result = {
                "id_news": new.idNews,
                "title_news": new.title_news,
                "images_poster": new.images_poster,
                "profile_user_post": make_link(localhost, f"/user/admin-fake"),
                "time_news": new.time_news,
                "category": new.category,
                "descript_pro": new.descript_pro,
            }
            results.append(result)
        number_item = len(results)
        return jsonify(
            {"data": results, "total_page": total_pape, "number_item": number_item}
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get all new by id_new
def get_new_by_idNews(id_news):
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        id_news = f"https://myanimelist.net/news/{id_news}"
        news = Anime_Manga_News.query.filter_by(idNews=id_news).first()
        if news is None:
            return jsonify({"message": "News not found"}), 404
        localhost = split_join(request.url)

        comment = []
        comment_news = Comment_News.query.filter_by(id_news=id_news).all()

        for comment_new in comment_news:
            profile = Profiles.query.filter_by(id_user=id_user).first()
            data_comment = {
                "id_comment": comment_new.id_comment,
                "id_user": id_user,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "content": comment_new.comment,
                "time_comment": comment_new.time_comment,
                "likes": 0,
                "is_comment_reply": False,
                "is_edited_comment": False,
                "replies": [],
            }
            comment.append(data_comment)
        result = {
            "title_news": news.title_news,
            "images_poster": news.images_poster,
            "profile_user_post": make_link(localhost, f"/user/admin-fake"),
            "time_news": news.time_news,
            "category": news.category,
            "descript_pro": news.descript_pro,
            "comment": comment,
        }
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# new_release_comics
def new_release_comics(index, type):
    page = request.args.get("page", default=1)
    data_new_release_comics = []
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        limit = 10
        offset = (int(page) - 1) * limit
        print("off")
        new_release = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index) & Manga_Update.id_manga.like(f"%{type}%")
            )
            .order_by(Manga_Update.time_release.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        for data in new_release:
            localhost = split_join(request.url)
            url_manga = make_link(
                localhost, f"/r{type}/{data.Manga_Update.path_segment_manga}"
            )
            url_chapter = make_link(
                localhost,
                f"/r{type}/{data.Manga_Update.path_segment_manga}/{data.Manga_Update.path_segment_chapter}",
            )

            data = {
                "url_manga": url_manga,
                "title_manga": data.List_Manga.title_manga,
                "author": data.List_Manga.author,
                "categories": data.List_Manga.categories,
                "image_poster_link_goc": data.Manga_Update.poster,
                "rate": data.Manga_Update.rate,
                "chapter_new": fix_title_chapter(url_chapter, url_manga),
                "url_chapter": url_chapter,
                "time_release": data.Manga_Update.time_release,
                "views": data.Manga_Update.views,
            }

            if r18_server_status() == "off":
                if check_r18(data["title_manga"]):
                    continue
                if check_r18(data["categories"]):
                    continue

            data_new_release_comics.append(data)

        return jsonify({"data": data_new_release_comics, "message": "Successful "})
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# RECENT COMICS
def recent_comics(index, type):
    page = request.args.get("page", default=1)
    data_recent_comics = []
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        limit = 20
        offset = (int(page) - 1) * limit
        recent_comics = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index) & Manga_Update.id_manga.like(f"%{type}%")
            )
            .order_by(Manga_Update.time_release.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        for recent_comic in recent_comics:

            localhost = split_join(request.url)
            data = {
                "url_manga": make_link(
                    localhost,
                    f"/r{type}/{recent_comic.Manga_Update.path_segment_manga}",
                ),
                "title_manga": recent_comic.Manga_Update.title_manga,
                "author": recent_comic.List_Manga.author,
                "categories": recent_comic.Manga_Update.categories,
                "image_poster_link_goc": recent_comic.Manga_Update.poster,
                "rate": recent_comic.Manga_Update.rate,
                "chapter_new": recent_comic.Manga_Update.path_segment_chapter,
                "url_chapter": make_link(
                    localhost,
                    f"/r{type}/{recent_comic.Manga_Update.path_segment_manga}/{recent_comic.Manga_Update.path_segment_chapter}",
                ),
                "time_release": recent_comic.Manga_Update.time_release,
                "path_segment_manga": recent_comic.Manga_Update.path_segment_manga,
            }

            if r18_server_status() == "off":
                if check_r18(data["title_manga"]):
                    continue
                if check_r18(data["categories"]):
                    continue

            data_recent_comics.append(data)

        return jsonify({"data": data_recent_comics, "message": "Successful "})
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# RECOMMENDED COMICS
def recommended_comics(index, type):
    page = request.args.get(f"page", default=1)
    data_recommended_comics = []
    total_page = 0
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        manga_count = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index) & (Manga_Update.id_manga.like(f"%{type}%"))
            )
            .count()
        )
        limit = 50
        total_page = math.ceil(manga_count / limit)
        offset = (int(page) - 1) * limit
        recommended_comics = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index) & (Manga_Update.id_manga.like(f"%{type}%"))
            )
            .limit(limit)
            .offset(offset)
            .all()
        )

        for manga in recommended_comics:

            localhost = split_join(request.url)
            data = {
                "url_manga": make_link(
                    localhost,
                    f"/r{type}/{manga.Manga_Update.path_segment_manga}",
                ),
                "title_manga": manga.Manga_Update.title_manga,
                "author": manga.List_Manga.author,
                "categories": manga.Manga_Update.categories,
                "image_poster_link_goc": manga.Manga_Update.poster,
                "rate": manga.Manga_Update.rate,
                "chapter_new": manga.Manga_Update.path_segment_chapter,
                "url_chapter": make_link(
                    localhost,
                    f"/r{type}/{manga.Manga_Update.path_segment_manga}/{manga.Manga_Update.path_segment_chapter}",
                ),
                "time_release": manga.Manga_Update.time_release,
                "path_segment_manga": manga.Manga_Update.path_segment_manga,
            }

            if r18_server_status() == "off":
                if check_r18(data["title_manga"]):
                    continue
                if check_r18(data["categories"]):
                    continue

            data_recommended_comics.append(data)

        return jsonify(
            {
                "data": data_recommended_comics,
                "message": "Successful ",
                "total_page": total_page,
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# COOMING SOON COMICS
def cooming_soon_comics(index, type):
    page = request.args.get("page", default=1)
    data_cooming_soon_comics = []
    total_page = 0
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        query_count = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index) & (Manga_Update.id_manga.like(f"%{type}%"))
            )
            .count()
        )
        limit = 20
        total_page = math.ceil(query_count / limit)
        offset = (int(page) - 1) * limit
        cooming_soon_comics = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index) & (Manga_Update.id_manga.like(f"%{type}%"))
            )
            .limit(limit)
            .offset(offset)
            .all()
        )

        for manga in cooming_soon_comics:
            localhost = split_join(request.url)
            data = {
                "title_manga": manga.Manga_Update.title_manga,
                "image_poster_link_goc": manga.Manga_Update.poster,
                "author": "AUTHOR",
                "categories": manga.Manga_Update.categories,
                "time_release": manga.Manga_Update.time_release,
                "url_manga": make_link(
                    localhost,
                    f"/r{type}/{manga.Manga_Update.path_segment_manga}",
                ),
            }

            if r18_server_status() == "off":
                if check_r18(data["title_manga"]):
                    continue
                if check_r18(data["categories"]):
                    continue

            data_cooming_soon_comics.append(data)

        return jsonify(
            {
                "data": data_cooming_soon_comics,
                "message": "Successful ",
                "total_page": total_page,
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# RANK WEEK
def rank_manga_week(index, type):
    page = request.args.get("page", default=1)
    data_rank_manga_week = []
    total_page = 0
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        query_count = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index)
                & (Manga_Update.id_chapter.like(f"%{type}%"))
            )
            .order_by(Manga_Update.views_week.desc())
            .count()
        )
        limit = 50
        offset = (int(page) - 1) * limit
        total_page = math.ceil(query_count / limit)
        rank_manga_week = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index)
                & (Manga_Update.id_chapter.like(f"%{type}%"))
            )
            .order_by(Manga_Update.views_week.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        for rank in rank_manga_week:

            localhost = split_join(request.url)
            data = {
                "url_manga": make_link(
                    localhost, f"/r{type}/{rank.List_Manga.path_segment_manga}"
                ),
                "title_manga": rank.List_Manga.title_manga,
                "author": rank.List_Manga.author,
                "image_poster_link_goc": rank.Manga_Update.poster,
                "categories": rank.List_Manga.categories,
                "views": rank.Manga_Update.views,
                "path_segment_manga": rank.Manga_Update.path_segment_manga,
            }

            if r18_server_status() == "off":
                if check_r18(data["title_manga"]):
                    continue
                if check_r18(data["categories"]):
                    continue

            data_rank_manga_week.append(data)

        return jsonify(
            {
                "data": data_rank_manga_week,
                "message": "Successful ",
                "total_page": total_page,
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# RANK MONTH
def rank_manga_month(index, type):
    page = request.args.get("page", default=1)
    data_rank_manga_month = []
    total_page = 0
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        query_count = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index)
                & (Manga_Update.id_chapter.like(f"%{type}%"))
            )
            .order_by(Manga_Update.views_month.desc())
            .count()
        )
        limit = 50
        total_page = math.ceil(query_count / limit)
        offset = (int(page) - 1) * limit
        rank_manga_month = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index)
                & (Manga_Update.id_chapter.like(f"%{type}%"))
            )
            .order_by(Manga_Update.views_month.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        for rank in rank_manga_month:

            localhost = split_join(request.url)
            data = {
                "url_manga": make_link(
                    localhost, f"/r{type}/{rank.List_Manga.path_segment_manga}"
                ),
                "title_manga": rank.List_Manga.title_manga,
                "author": rank.List_Manga.author,
                "image_poster_link_goc": rank.Manga_Update.poster,
                "categories": rank.List_Manga.categories,
                "views": rank.Manga_Update.views,
                "path_segment_manga": rank.Manga_Update.path_segment_manga,
            }

            if r18_server_status() == "off":
                if check_r18(data["title_manga"]):
                    continue
                if check_r18(data["categories"]):
                    continue

            data_rank_manga_month.append(data)

        return jsonify(
            {
                "data": data_rank_manga_month,
                "message": "Successful ",
                "total_page": total_page,
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# RANK YEAR
def rank_manga_year(index, type):
    page = request.args.get("page", default=1)
    data_rank_manga_year = []
    total_page = 0
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        query_count = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index)
                & (Manga_Update.id_chapter.like(f"%{type}%"))
            )
            .order_by(Manga_Update.views.desc())
            .count()
        )
        limit = 70
        total_page = math.ceil(query_count / limit)
        offset = (int(page) - 1) * limit
        rank_manga_year = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index)
                & (Manga_Update.id_chapter.like(f"%{type}%"))
            )
            .order_by(Manga_Update.views.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        for rank in rank_manga_year:

            localhost = split_join(request.url)
            data = {
                "url_manga": make_link(
                    localhost, f"/r{type}/{rank.List_Manga.path_segment_manga}"
                ),
                "title_manga": rank.List_Manga.title_manga,
                "author": rank.List_Manga.author,
                "image_poster_link_goc": rank.Manga_Update.poster,
                "categories": rank.List_Manga.categories,
                "views": rank.Manga_Update.views,
                "path_segment_manga": rank.Manga_Update.path_segment_manga,
            }

            if r18_server_status() == "off":
                if check_r18(data["title_manga"]):
                    continue
                if check_r18(data["categories"]):
                    continue

            data_rank_manga_year.append(data)

        return jsonify(
            {
                "data": data_rank_manga_year,
                "message": "Successful ",
                "total_page": total_page,
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# CURRENTLY READING by chapter
def currently_reading(type):
    list_manga = []
    added_list = []
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    page = request.args.get("page", default=1)
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        limit = 7
        offset = (int(page) - 1) * limit
        log_user = (
            db.session.query(LogUser, Manga_Update)
            .join(
                Manga_Update,
                LogUser.path_segment_manga == Manga_Update.path_segment_manga,
            )
            .filter(
                (LogUser.id_user == id_user)
                & (Manga_Update.id_chapter.like(f"%{type}%"))
            )
            .order_by(LogUser.read_time.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )
        print(log_user)
        for log, manga in log_user:
            title_manga = manga.title_manga
            if title_manga in added_list:
                pass
            else:
                localhost = split_join(request.url)
                data = {
                    "url_manga": make_link(
                        localhost, f"/r{type}/{manga.path_segment_manga}/"
                    ),
                    "title_manga": log.title_manga,
                    "categories": log.type,
                    "poster": log.poster,
                    "rate": manga.rate,
                    "last_time_read": get_time_diff(log.read_time, datetime.now()),
                }
                list_manga.append(data)
                added_list.append(title_manga)

        return list_manga
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# card stats
def card_stats():
    try:
        LM = List_Manga
        MU = Manga_Update
        C = Comments
        total_users = Users.query.count()
        result = (
            db.session.query(
                func.sum(MU.views).label("total_views"),
                func.count(LM.id_manga).label("total_manga"),
                func.count(C.id_comment).label("total_comments"),
            )
            .outerjoin(LM, MU.path_segment_manga == LM.path_segment_manga)
            .outerjoin(C, MU.path_segment_manga == C.path_segment_manga)
            .one()
        )
        data = {
            "total_views": format_with_dot(result.total_views),
            "total_users": format_with_dot(total_users),
            "total_listmanga": format_with_dot(result.total_manga),
            "total_comments": format_with_dot(result.total_comments),
        }
        return jsonify(data)
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500
