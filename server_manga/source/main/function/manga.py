from flask import redirect, request, jsonify
from wtforms import SubmitField
from datetime import datetime
from source.validate_form import *

from source.main.model import *
import random
import mysql.connector
from email.message import EmailMessage
from source import db, mail, app, secret, login_manager
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
import uuid
import string


# create manga
def create_manga_new():
    try:
        form = NewMangaForm()
        current_user = get_jwt_identity()
        id_user = current_user.get("UserID")

        localhost = split_join(request.url)
        # Tạo ID ngẫu nhiên
        random_letters = "".join(
            random.choices(string.ascii_lowercase, k=2)
        )  # 2 chữ cái thường
        random_digits = "".join(random.choices(string.digits, k=6))  # 6 chữ số
        random_id = f"{random_letters}{random_digits}"

        # Tạo id_manga
        id_manga = f"{localhost}/rmanga/manga-{random_id}"

        # Tạo path_segment_manga từ id_manga
        path_segment_manga = f"manga-{random_id}"
        # poster
        default_poster = "https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg"

        poster_original = (
            convert_path_image(form.poster_original.data)
            if form.poster_original.data
            else default_poster
        )
        id_server = get_id_server(1)
        if form.validate_on_submit():
            new_manga = List_Manga(
                id_manga=id_manga,
                path_segment_manga=path_segment_manga,
                title_manga=form.title_manga.data,
                descript_manga=form.descript_manga.data,
                poster_upload=poster_original,
                poster_original=poster_original,
                detail_manga=form.detail_manga.data,
                categories=form.categories.data,
                chapters=form.chapters.data,
                rate="0",
                views_original="0",
                status=form.status.data,
                author=form.author.data,
                id_server=id_server,
            )
            db.session.add(new_manga)
            db.session.commit()

            profile = Profiles.query.filter_by(id_user=id_user).first()
            if profile is None:
                return jsonify({"message": "User not found"}), 404

            manga = {
                "id_manga": id_manga,
                "path_segment_manga": path_segment_manga,
                "title_manga": form.title_manga.data,
                "descript_manga": form.descript_manga.data,
                "poster_upload": poster_original,
                "poster_original": poster_original,
                "detail_manga": form.detail_manga.data,
                "categories": form.categories.data,
                "chapters": form.chapters.data,
                "rate": "0",
                "views_original": "0",
                "status": form.status.data,
                "author": form.author.data,
                "user_name": profile.name_user,
                "id_user": id_user,
                "id_server": id_server,
                "role": profile.role,
            }
            return (
                jsonify(
                    {
                        "new_manga": manga,
                        "message": "Add new manga successfully",
                        "status": 200,
                    }
                ),
                200,
            )
        else:
            return jsonify({"errMsg": "Invalid form data", "errors": form.errors}), 400

    except Exception as e:
        print("error", e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get list manga and novel
def get_all_data(index):
    page = request.args.get("page")
    try:
        data = []
        total_page = 0
        number_item = 0
        id_server = get_id_server(index)
        query = List_Manga.query.filter_by(id_server=id_server)

        if page:
            limit = 20
            total_page = math.ceil(len(query) / limit)
            offset = (int(page) - 1) * limit
            manga = (
                List_Manga.query.filter_by(id_server=id_server)
                .order_by(List_Manga.views_original.asc())
                .limit(limit)
                .offset(offset)
                .all()
            )
            for item in manga:
                if "novel" in item.id_manga:
                    item.genres = "Novel"
                else:
                    item.genres = "Manga"
                list_all_manga = {
                    "genres": item.genres,
                    "id_manga": item.id_manga,
                    "title": item.title_manga,
                    "description": item.descript_manga,
                    "poster": item.poster_original,
                    "categories": item.categories,
                    "rate": item.rate,
                    "views": item.views_original,
                    "status": item.status,
                    "author": item.author,
                    "comments": item.comments,
                }
                data.append(list_all_manga)
        else:
            for item in query:
                if "novel" in item.id_manga:
                    item.genres = "Novel"
                else:
                    item.genres = "Manga"
                list_all_manga = {
                    "genres": item.genres,
                    "id_manga": item.id_manga,
                    "title": item.title_manga,
                    "description": item.descript_manga,
                    "poster": item.poster_original,
                    "categories": item.categories,
                    "rate": item.rate,
                    "views": item.views_original,
                    "status": item.status,
                    "author": item.author,
                    "comments": item.comments,
                }
                data.append(list_all_manga)
        number_item = len(data)
        return (
            jsonify(
                {
                    "status": 200,
                    "data": data,
                    "total_page": total_page,
                    "number_item": number_item,
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# filter manga
def filter_manga(index):
    try:
        page = int(request.args.get("page", default=1))
        search = request.args.get("search", default=None)
        limit = 5
        offset = (page - 1) * limit

        id_server = get_id_server(index)

        base_query = List_Manga.query.filter_by(id_server=id_server)

        if search:
            search_filter = or_(
                List_Manga.categories.ilike(f"%{search}%"),
                List_Manga.author.ilike(f"%{search}%"),
                List_Manga.title_manga.ilike(f"%{search}%"),
                List_Manga.path_segment_manga.ilike(f"%{search}%"),
                List_Manga.id_manga.ilike(f"%{search}%"),
            )
            base_query = base_query.filter(search_filter)

        total_items = base_query.count()
        total_page = math.ceil(total_items / limit)

        manga_list = (
            base_query.order_by(List_Manga.views_original.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        data = []
        for item in manga_list:
            genres = "Novel" if "novel" in item.id_manga else "Manga"
            list_all_manga = {
                "genres": genres,
                "id_manga": item.id_manga,
                "title": item.title_manga,
                "description": item.descript_manga,
                "poster": item.poster_original,
                "categories": item.categories,
                "rate": item.rate,
                "views": item.views_original,
                "status": item.status,
                "author": item.author,
                "comments": item.comments,
                "path_segment_manga": item.path_segment_manga,
            }
            data.append(list_all_manga)

        return (
            jsonify(
                {
                    "status": 200,
                    "data": data,
                    "total_page": total_page,
                    "number_item": total_items,
                }
            ),
            200,
        )

    except Exception as e:
        print(f"Error in get_manga_by_admin: {e}")
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get list manga by path
def get_listManga(path):
    try:
        print("___path___" + str(path))
        manga = List_Manga.query.filter(
            List_Manga.path_segment_manga.ilike(f"%{path}%")
        ).first()
        print("poster", manga.poster_original)

        if manga:
            update_manga = Manga_Update.query.filter_by(id_manga=manga.id_manga).first()
            localhost = split_join(request.url)
            chapters = list_chapter(localhost, manga.id_manga, path, "manga")
            print("-------------", chapters)
            if isinstance(chapters, list):
                print("_____________PRINT__chapters___", chapters)
            else:
                raise ValueError(
                    "Expected chapters to be a list, but got something else"
                )

            id_manga = manga.path_segment_manga
            manga_info = {
                "genres": "manga",
                "id_manga": id_manga,
                "title": manga.title_manga,
                "description": manga.descript_manga,
                "poster": manga.poster_original,
                "categories": manga.categories,
                "rate": manga.rate,
                "views": manga.views_original,
                "status": manga.status,
                "author": manga.author,
                "chapters": chapters,
                "time_release": format_date(update_manga.time_release),
                "name_path": make_title(manga.title_manga, id_manga),
            }
            all_review = Reviews_Manga.query.all()
            review_of_manga = None
            for review in all_review:
                if (
                    convert_title_manga(review.link_manga).lower()
                    == str(manga.title_manga).lower()
                ):
                    review_of_manga = Reviews_Manga.query.filter(
                        Reviews_Manga.idReview == review.idReview
                    ).first()
                    break
            if review_of_manga is None:
                review_info = {"Err": "don't have review"}
            else:
                review_info = {
                    "link_user": review_of_manga.link_user,
                    "link_avatar_user": review_of_manga.link_avatar_user_comment,
                    "link_manga": review_of_manga.link_manga,
                    "noi_dung": review_of_manga.noi_dung,
                    "time_release": review_of_manga.time_review,
                }
            return (
                jsonify(
                    {
                        "status": 200,
                        "manga_info": manga_info,
                        "review_info": review_info,
                    }
                ),
                200,
            )
        else:
            return jsonify(msg="Manga does not exist!"), 404

    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get list novel by path
def get_Listnovel(path):
    try:
        novel = List_Manga.query.filter(
            List_Manga.path_segment_manga.ilike(f"%{path}%")
        ).first()
        if novel is None:
            return jsonify(msg="Novel does not exist!"), 404

        localhost = split_join(request.url)
        chapters = list_chapter_novel(localhost, novel.id_manga, path, "novel")

        manga_info = {
            "genres": "novel",
            "id_manga": novel.id_manga,
            "title": novel.title_manga,
            "description": novel.descript_manga,
            "poster": novel.poster_original,
            "categories": novel.categories,
            "rate": novel.rate,
            "views": novel.views_original,
            "status": novel.status,
            "author": novel.author,
            "comments": get_comments(path),
            "chapters": chapters,
        }
        all_review = Reviews_Manga.query.all()
        review_of_manga = None
        for review in all_review:
            if (
                convert_title_manga(review.link_manga).lower()
                == str(novel.title_manga).lower()
            ):
                review_of_manga = Reviews_Manga.query.filter(
                    Reviews_Manga.idReview == review.idReview
                ).first()
                break
        if review_of_manga is None:
            review_info = {"Err": "don't have review"}
        else:
            review_info = {
                "link_user": review_of_manga.link_user,
                "link_avatar_user": review_of_manga.link_avatar_user_comment,
                "link_manga": review_of_manga.link_manga,
                "noi_dung": review_of_manga.noi_dung,
                "time_release": review_of_manga.time_review,
            }
        return (
            jsonify(
                {"status": 200, "manga_info": manga_info, "review_info": review_info}
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# edit manga
def edit_manga(path_segment_manga):
    form = NewMangaForm()
    try:
        if path_segment_manga is None:
            return jsonify({"message": " This link has no data, please try again"}), 403
        manga = (
            List_Manga.query.filter(List_Manga.path_segment_manga == path_segment_manga)
            .order_by(List_Manga.id_manga.desc())
            .first()
        )
        if form.poster_original.data:
            poster_original = convert_path_image(form.poster_original.data)
        else:
            poster_original = manga.poster_original
        if manga:
            manga.title_manga = form.title_manga.data
            manga.poster_original = poster_original
            manga.categories = form.categories.data
            manga.author = form.author.data
            db.session.commit()
        manga_update = {
            "id_manga": manga.path_segment_manga,
            "title_manga": form.title_manga.data,
            "poster_original": poster_original,
            "categories": form.categories.data,
            "author": form.author.data,
        }
        return (
            jsonify(
                {
                    "manga_update": manga_update,
                    "message": "Update manga successfully",
                    "status": 200,
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# delete manga
def delete_manga(path_segment_manga, path_segment_chapter):
    path_segment = f"{path_segment_manga}-{path_segment_chapter}"
    print(path_segment)
    try:
        comments = Comments.query.filter_by(path_segment_manga=path_segment_manga).all()

        for comment in comments:
            LikesComment.query.filter_by(id_comment=comment.id_comment).delete()
            delete_reply_comment(comment)
            db.session.delete(comment)
            CommentDiary.query.filter_by(id_comment=comment.id_comment).delete()

        List_Manga.query.filter(
            List_Manga.path_segment_manga == path_segment_manga
        ).delete()
        if path_segment and path_segment_chapter:
            Imaga_Chapter.query.filter_by(path_segment=path_segment).delete()

        LogUser.query.filter_by(path_segment_manga=path_segment_manga).delete()
        Manga_Update.query.filter_by(path_segment_manga=path_segment_manga).delete()
        db.session.commit()
        return jsonify({"message": "Manga deleted successfully", "status": 200}), 200

    except Exception as e:
        print("error", str(e))
        jsonify(
            {"status": 500, "message": "need to fill in all email and password fields"}
        ), 500


# get image chapter manga
def get_image_chapter(path_segment_manga, path_segment_chapter):
    path_segment = f"{path_segment_manga}-{path_segment_chapter}"
    try:
        chapters = Imaga_Chapter.query.filter_by(path_segment=path_segment).first()

        if chapters is None:
            return jsonify(msg="NONE"), 404

        image_chapter = chapters.image_chapter_original.split(",")
        chapter = List_Chapter.query.filter_by(id_chapter=chapters.id_chapter).first()
        manga = Manga_Update.query.filter_by(id_manga=chapter.id_manga).first()

        manga.views_week += 1
        manga.views_month += 1
        manga.views += 1
        db.session.commit()

        chapter_info = {
            "title": manga.title_manga,
            "image_chapter": image_chapter,
            "chapter_name": path_segment_chapter,
        }

        return jsonify({"status": 200, "data": chapter_info}), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get content chapter novel
def get_content_chapter(path_segment_manga, path_segment_chapter):
    path_segment = f"{path_segment_manga}-{path_segment_chapter}"
    try:
        if path_segment_manga is None and path_segment_chapter is None:
            return (
                jsonify(
                    {
                        "status": 403,
                        "message": "Access forbidden: required path segments are missing.",
                    }
                ),
                403,
            )
        novel = Manga_Update.query.filter_by(
            path_segment_manga=path_segment_manga
        ).first()
        chapter = Content_Chapter.query.filter_by(path_segment=path_segment).first()
        if chapter is None:
            return (
                jsonify({"status": 404, "message": "Not Found Chapter", "data": []}),
                404,
            )

        content_chapter = chapter.content_chapter

        novel.views_week += 1
        novel.views_month += 1
        novel.views += 1
        db.session.commit()

        chapter_info = {
            "title": novel.title_manga,
            "content": content_chapter,
            "chapter_name": path_segment_chapter,
        }
        return jsonify({"status": 200, "data": chapter_info}), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get all comment manga
def get_all_comment_manga(path):
    return get_comments(path)


# get comment chapter manga
def get_comment_chapter(path_segment_manga, path_segment_chapter):
    try:
        manga = List_Manga.query.filter(
            List_Manga.path_segment_manga.ilike(f"%{path_segment_manga}%")
        ).first()
        if manga is None:
            return jsonify({"status": 404, "message": " Manga Not Found"}), 404
        chapter_manga = List_Chapter.query.filter_by(
            id_manga=manga.id_manga, path_segment_chapter=path_segment_chapter
        ).first()
        chapter_novel = List_Chapter_Novel.query.filter(
            List_Chapter_Novel.id_manga == manga.id_manga,
            List_Chapter_Novel.id_chapter.like(f"%{path_segment_chapter}%"),
        ).first()
        if chapter_manga is None and chapter_novel is None:
            return jsonify({"message": "Chapter not found"}), 404

        comments = (
            db.session.query(Comments)
            .filter(
                Comments.path_segment_manga.ilike(f"%{path_segment_manga}"),
                Comments.path_segment_chapter == path_segment_chapter,
            )
            .order_by(
                func.STR_TO_DATE(Comments.time_comment, "%H:%i:%S %d-%m-%Y").desc()
            )
            .all()
        )
        if comments is None:
            return (
                jsonify({"message": "There is no comment for this chapter/manga"}),
                404,
            )

        result = []

        for comment in comments:
            like_count = LikesComment.query.filter_by(
                id_comment=comment.id_comment, status="like"
            ).count()
            profile = Profiles.query.filter_by(id_user=comment.id_user).first()
            if comment.is_comment_reply == 0:
                data = {
                    "id_user": profile.id_user,
                    "name_user": profile.name_user,
                    "avatar_user": profile.avatar_user,
                    "id_comment": comment.id_comment,
                    "content": comment.content,
                    "likes": like_count,
                    "time_comment": convert_time(comment.time_comment),
                    "is_edited_comment": comment.is_edited_comment,
                    "replies_content": [],
                }
                result.append(data)

        for comment in comments:
            if comment.is_comment_reply == 1:
                like_count = LikesComment.query.filter_by(
                    id_comment=comment.id_comment, status="like"
                ).count()
                profile = Profiles.query.filter_by(id_user=comment.id_user).first()
                replied_comment = {
                    "id_user": profile.id_user,
                    "name_user": profile.name_user,
                    "avatar_user": profile.avatar_user,
                    "id_comment": comment.id_comment,
                    "likes": like_count,
                    "content": comment.content,
                    "time_comment": convert_time(comment.time_comment),
                    "is_edited_comment": comment.is_edited_comment,
                }
                for data in result:
                    if data["id_comment"] == comment.reply_id_comment:
                        data["replies_content"].append(replied_comment)
                data["reply"] = len(data["replies_content"])

        return (
            jsonify({"data": result, "status": 200}),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# create comment chapter
def create_comment_chapter(path_segment_manga, path_segment_chapter):
    form = CommentsForm()
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        profile = Profiles.query.filter_by(id_user=id_user).first()

        manga = List_Manga.query.filter(
            List_Manga.path_segment_manga.ilike(f"%{path_segment_manga}%")
        ).first()
        if manga is None:
            return jsonify({"message": "Manga not found"}), 404

        chapter = List_Chapter.query.filter_by(
            id_manga=manga.id_manga, path_segment_chapter=path_segment_chapter
        ).first()
        chapter_novel = List_Chapter_Novel.query.filter(
            List_Chapter_Novel.id_manga == manga.id_manga,
            List_Chapter_Novel.id_chapter.like(f"%{path_segment_chapter}%"),
        ).first()
        if chapter is None and chapter_novel is None:
            return jsonify({"message": "Chapter not found"}), 404

        if form.validate_on_submit():
            content = form.content.data

            time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
            comment = Comments(
                id_user=id_user,
                path_segment_manga=path_segment_manga,
                path_segment_chapter=path_segment_chapter,
                content=content,
                time_comment=time,
            )
            profile.number_comments += 1
            db.session.add(comment)
            db.session.commit()
            comment = (
                db.session.query(Comments)
                .filter_by(
                    id_user=id_user,
                    path_segment_manga=path_segment_manga,
                    path_segment_chapter=path_segment_chapter,
                    content=content,
                )
                .first()
            )

            responses = {
                "id_comment": comment.id_comment,
                "id_user": id_user,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "chapter": path_segment_chapter,
                "content": content,
                "time_comment": convert_time(time),
            }
            return (
                jsonify(
                    {
                        "data": responses,
                        "message": "New comment added successfully",
                        "status": 200,
                    }
                ),
                200,
            )
        return jsonify(error=form.errors), 400
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get comment by path
def get_comment_manga(path_segment_manga):
    return get_comments(path_segment_manga)


# create comment manga
def create_comment_manga(path_segment_manga):
    form = CommentsForm()
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        profile = Profiles.query.filter_by(id_user=id_user).first()
        manga = List_Manga.query.filter(
            List_Manga.path_segment_manga.ilike(f"%{path_segment_manga}%")
        ).first()
        if manga is None:
            return jsonify({"message": "Manga not found"}), 404

        if form.validate_on_submit():
            content = form.content.data

            path_segment_chapter = "None"

            time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
            comment = Comments(
                id_user=id_user,
                path_segment_manga=manga.path_segment_manga,
                path_segment_chapter=path_segment_chapter,
                content=content,
                time_comment=time,
            )
            profile.number_comments += 1
            db.session.add(comment)
            db.session.commit()
            responses = {
                "id_user": id_user,
                "id_comment": comment.id_comment,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "chapter": path_segment_chapter,
                "content": content,
                "time_comment": convert_time(time),
            }
            return jsonify(
                {
                    "data": responses,
                    "message": "New comment added successfully",
                    "status": 200,
                }
            )
        return jsonify(error=form.errors), 400
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# create rely_comment
def create_reply_comments(id_comment):
    form = CommentsForm()
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        profile = Profiles.query.filter_by(id_user=id_user).first()
        comment_to_reply = Comments.query.filter(
            Comments.id_comment == id_comment
        ).first()
        if comment_to_reply is None:
            return jsonify({"status": 404, "message": "Not found comment"}), 404
        if form.validate_on_submit():
            content = form.content.data
            time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")

            reply_comment = Comments(
                id_user=id_user,
                content=content,
                time_comment=time,
                path_segment_manga=comment_to_reply.path_segment_manga,
                path_segment_chapter=comment_to_reply.path_segment_chapter,
                is_comment_reply=True,
                reply_id_comment=id_comment,
            )

            db.session.add(reply_comment)
            db.session.commit()
            comment_data = (
                db.session.query(Comments)
                .filter_by(
                    id_user=id_user,
                    path_segment_manga=reply_comment.path_segment_manga,
                    path_segment_chapter=reply_comment.path_segment_chapter,
                    content=content,
                )
                .first()
            )
            responses = {
                "id_comment": comment_data.id_comment,
                "id_user": id_user,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "content": content,
                "chapter": comment_to_reply.path_segment_chapter,
                "time_comment": convert_time(time),
                "is_comment_reply": True,
                "reply_id_comment": id_comment,
            }
            return jsonify(
                {
                    "data": responses,
                    "message": "New replies comment added successfully",
                    "status": 200,
                }
            )
        return jsonify(error=form.errors), 400
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# delete comment
def delete_comment(id_comment):
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        comment = Comments.query.filter_by(id_comment=id_comment).first()

        if comment.id_user != id_user:
            return (
                jsonify({"error": "You do not have permission to delete comment"}),
                400,
            )

        comment_diary = CommentDiary(
            id_comment=comment.id_comment,
            content=comment.content,
            comment_type="delete",
            time_comment=comment.time_comment,
        )
        db.session.add(comment_diary)

        LikesComment.query.filter_by(id_comment=id_comment).delete()

        delete_reply_comment(comment)
        db.session.delete(comment)
        db.session.commit()
        return jsonify({"message": "Comment deleted successfully", "status": 200}), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# edit comment
def edit_comments(id_comment):
    form = CommentsForm()
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        profile = Profiles.query.filter_by(id_user=id_user).first()
        comments = Comments.query.filter_by(id_comment=id_comment).first()

        if comments.id_user != id_user:
            return jsonify({"error": "You do not have permission to edit comment"}), 400

        if form.validate_on_submit():
            content = form.content.data
            time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")

            if comments.is_edited_comment == False:
                comment = CommentDiary(
                    id_comment=id_comment,
                    content=comments.content,
                    comment_type="before",
                    time_comment=comments.time_comment,
                )
                db.session.add(comment)
                db.session.commit()

            comments.content = content
            edit_comment = CommentDiary(
                id_comment=id_comment,
                content=content,
                comment_type="after",
                time_comment=time,
            )
            db.session.add(edit_comment)

            comments.is_edited_comment = True
            db.session.commit()
            responses = {
                "id_user": id_user,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "chapter": comments.path_segment_chapter,
                "content_update": content,
                "time_comment": convert_time(comments.time_comment),
            }
            return jsonify(
                {
                    "data": responses,
                    "status": 200,
                    "message": "Change comment successfully",
                }
            )
        return jsonify(error=form.errors), 400
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get diary comment
def comments_diary(id_comment):
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        profile = Profiles.query.filter_by(id_user=id_user).first()
        comment = Comments.query.filter_by(id_comment=id_comment).first()
        if comment is None:
            return jsonify({"message": "Not found comment"}), 404
        comment_diary = (
            CommentDiary.query.filter_by(id_comment=id_comment)
            .order_by(
                func.STR_TO_DATE(CommentDiary.time_comment, "%H:%i:%S %d-%m-%Y").asc()
            )
            .all()
        )
        responses = []
        for comm in comment_diary:
            result = {
                "id_user": id_user,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "chapter": comment.path_segment_chapter,
                "status": comm.comment_type,
                "content": comm.content,
                "time_comment": convert_time(comm.time_comment),
            }
            responses.append(result)
        return jsonify({"comment_diary": responses}), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# like comment
def like_comment(id_user, id_comment):
    try:
        like_status = LikesComment.query.filter_by(
            id_comment=id_comment, id_user=id_user
        ).first()
        comment = Comments.query.filter_by(id_comment=id_comment).first()
        if not comment:
            return jsonify({"message": "Comment does not exist!"}), 404
        if like_status:
            if like_status.status == "like":
                like_status.status = "unlike"
                db.session.commit()
                return jsonify({"message": "Unliked Comment successfully"}), 200
            else:
                like_status.status = "like"
                db.session.commit()
                return jsonify({"message": "Liked comment successfully"}), 200
        else:
            new_like = LikesComment(
                id_comment=id_comment, id_user=id_user, status="like"
            )
            db.session.add(new_like)
            db.session.commit()
            return jsonify({"message": "Liked comment successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get category
def get_all_categories():
    all_categories = []
    try:
        result = List_Category.query.all()
        for category in result:
            data = {
                "category_name": category.category_name,
                "decription": category.description,
                "image": category.image,
            }
            all_categories.append(data)

        return jsonify(all_categories)
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# search manga
def search_manga(index):
    try:
        key = request.args.get("search")
        limit = 10
        result = db.session.query(List_Manga, Manga_Update)
        id_server = get_id_server(index)
        if key:
            search_manga = or_(
                List_Manga.title_manga.ilike(f"%{key}%"),
                List_Manga.author.ilike(f"%{key}%"),
                List_Manga.path_segment_manga.ilike(f"%{key}%"),
            )
            result = result.filter(search_manga, List_Manga.id_server == id_server)

            list_manga = (
                result.join(Manga_Update, List_Manga.id_manga == Manga_Update.id_manga)
                .order_by(Manga_Update.time_release.desc())
                .limit(limit)
                .all()
            )
            manga_list = []
            for manga in list_manga:
                id_manga = manga.List_Manga.path_segment_manga
                title = manga.List_Manga.title_manga
                data = {
                    "id_manga": id_manga,
                    "title": title,
                    "poster": manga.List_Manga.poster_original,
                    "rate": manga.Manga_Update.rate,
                    "author": manga.List_Manga.author,
                    "name_path": make_title(title, id_manga),
                }
                print("rate", manga.Manga_Update.rate)
                manga_list.append(data)
            if list_manga is None:
                return jsonify({"message": "Manga does not exist!"}), 404
            return jsonify({"data": manga_list, "status": 200})
        else:
            return (
                jsonify({"data": [], "status": 200, "message": "Manga Not Found"}),
                200,
            )

    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# filter manga by category
def list_manta_by_category(index):
    key = request.args.get("name_category")
    page = request.args.get("page", default=1)
    result = []
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        query_count = (
            db.session.query(Manga_Update, List_Manga)
            .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
            .join(List_Server, List_Manga.id_server == List_Server.name_server)
            .filter(
                (List_Server.index == index) & (List_Manga.categories.like(f"%{key}%"))
            )
            .count()
        )
        limit = 49
        total_page = math.ceil(query_count / limit)
        offset = (int(page) - 1) * limit
        if key:
            localhost = split_join(request.url)
            mangas = (
                db.session.query(Manga_Update, List_Manga)
                .join(List_Manga, Manga_Update.id_manga == List_Manga.id_manga)
                .join(List_Server, List_Manga.id_server == List_Server.name_server)
                .filter(
                    (List_Server.index == index)
                    & (List_Manga.categories.like(f"%{key}%"))
                )
                .limit(limit)
                .offset(offset)
                .all()
            )
            if mangas is None:
                return jsonify({"message": "Manga does not exist!"}), 404
            for manga in mangas:
                if r18_server_status() == "off":
                    if check_r18(
                        manga.List_Manga.categories + manga.List_Manga.title_manga
                    ):
                        continue
                id_manga = manga.List_Manga.path_segment_manga
                data = {
                    "id_manga": id_manga,
                    "title": manga.List_Manga.title_manga,
                    "description": manga.List_Manga.descript_manga,
                    "poster": manga.List_Manga.poster_original,
                    "categories": manga.List_Manga.categories,
                    "rate": manga.List_Manga.rate,
                    "views": manga.List_Manga.views_original,
                    "status": manga.List_Manga.status,
                    "time": manga.Manga_Update.time_release,
                    "author": manga.List_Manga.author,
                    "id_server": manga.List_Manga.id_server,
                    "name_path": make_title(manga.List_Manga.title_manga, id_manga),
                }
                result.append(data)

            return jsonify({"data": result, "total_page": total_page})
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# views weed and year
def views_manga():
    views = []
    try:
        limit = 10
        manga = (
            Manga_Update.query.order_by(Manga_Update.time_release.desc())
            .limit(limit)
            .all()
        )

        for item in manga:
            data = {"views_week": item.views_week, "views_year": item.views}
            views.append(data)
        return jsonify(views)

    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# list all chapter manga by id manga
def list_all_chapter(id_manga):
    try:
        chapters = List_Chapter.query.filter(
            List_Chapter.id_manga.like(f"%{id_manga}%")
        ).all()
        data = []
        for item in chapters:
            data.append(
                {
                    "id_manga": shorten_id(item.id_manga),
                    "path_segment_chapter": item.path_segment_chapter,
                    "id_chapter": item.id_chapter,
                }
            )
        return jsonify({"data": data, "status": 200}), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


def list_all_chapter(id_manga):
    try:
        chapters = List_Chapter.query.filter(
            List_Chapter.id_manga.like(f"%{id_manga}%")
        ).all()

        ListChapters = []
        chapterNameNumber = 0
        for query in chapters:
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

            chapter = {
                "id_chapter": path_segment_chapter,
                "chapter_number": chapter_number,
            }
            ListChapters.append(chapter)

        ListChapters.sort(key=lambda x: x["chapter_number"])

        return ListChapters
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


def list_chapter_by_id(id_manga):
    try:
        chapters = List_Chapter.query.filter(
            List_Chapter.id_manga.like(f"%{id_manga}%")
        ).all()
        data = []
        for item in chapters:
            data.append(
                {
                    "id_manga": shorten_id(item.id_manga),
                    "path_segment_chapter": item.path_segment_chapter,
                    "id_chapter": item.id_chapter,
                }
            )
        return jsonify({"data": data, "status": 200}), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


def filterManga(index):
    try:
        server = get_id_server(index)
        data = request.form
        categories = data["categories"]
        chapter_filter = data["chapter_filter"]
        status_filter = data["status_filter"]
        arrange_filter = data["arrange_filter"]

        query_base = List_Manga.query.filter_by(id_server=server)

    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500
