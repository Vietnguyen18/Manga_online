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


# create manga
def create_manga_new():
    form = NewMangaForm()
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        id_server = get_id_server(form.id_server.data)
        poster_upload = convert_path_image(form.poster_upload.data)
        poster_original = convert_path_image(form.poster_original.data)
        if form.validate_on_submit():
            new_manga = List_Manga(
                id_manga=form.path_segment_manga.data,
                path_segment_manga=form.path_segment_manga.data,
                title_manga=form.title_manga.data,
                descript_manga=form.descript_manga.data,
                poster_upload=poster_upload,
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
                return jsonify({"message": " User not found"}), 404
            manga = {
                "id_manga": form.path_segment_manga.data,
                "path_segment_manga": form.path_segment_manga.data,
                "title_manga": form.title_manga.data,
                "descript_manga": form.descript_manga.data,
                "poster_upload": poster_upload,
                "poster_original": poster_original,
                "detail_manga": form.detail_manga.data,
                "categories": form.categories.data,
                "chapters": form.chapters.data,
                "rate": "0",
                "views_original": "0",
                "status": form.status.data,
                "author": form.author.data,
                "id_server": id_server,
                "user_name": profile.name_user,
                "id_user": id_user,
                "role": profile.role,
            }
            return (
                jsonify({"new_manga": manga, "message": "Add new manga successfully"}),
                200,
            )

    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get list manga and novel
def get_all_data(index):
    page = request.args.get("page")
    try:
        data = []
        total_page = 0
        number_item = 0
        id_server = get_id_server(index)
        query = List_Manga.query.filter_by(id_server=id_server).all()
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


# get list manga by path
def get_listManga(path):
    try:
        print("___path___" + str(path))
        manga = List_Manga.query.filter_by(path_segment_manga=path).first()
        if manga is None:
            return jsonify(msg="Manga does not exist!"), 404

        localhost = split_join(request.url)
        chapters = list_chapter(localhost, manga.id_manga, path, "manga")
        print("_____________PRINT__chapters___" + str(chapters))
        manga_info = {
            "genres": "manga",
            "id_manga": manga.id_manga,
            "title": manga.title_manga,
            "description": manga.descript_manga,
            "poster": manga.poster_original,
            "categories": manga.categories,
            "rate": manga.rate,
            "views": manga.views_original,
            "status": manga.status,
            "author": manga.author,
            "comments": get_comments(path),
            "chapters": chapters,
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
                {"status": 200, "manga_info": manga_info, "review_info": review_info}
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# get list novel by path
def get_Listnovel(path):
    try:
        novel = List_Manga.query.filter_by(path_segment_manga=path).first()
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
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        id_server = get_id_server(form.id_server.data)
        if path_segment_manga is None:
            return jsonify({"message": " This link has no data, please try again"}), 403
        manga = (
            List_Manga.query.filter(List_Manga.path_segment_manga == path_segment_manga)
            .order_by(List_Manga.id_manga.desc())
            .first()
        )
        poster_upload = convert_path_image(form.poster_upload.data)
        poster_original = convert_path_image(form.poster_original.data)
        if manga:
            manga.title_manga = form.title_manga.data
            manga.descript_manga = form.descript_manga.data
            manga.poster_upload = form.poster_upload.data
            manga.poster_original = form.poster_original.data
            manga.detail_manga = form.detail_manga.data
            manga.categories = form.categories.data
            manga.chapters = form.chapters.data
            manga.status = form.status.data
            manga.author = form.author.data
            db.session.commit()
        profile = Profiles.query.filter_by(id_user=id_user).first()
        if profile is None:
            return jsonify({"message": " User not found"}), 404
        manga_update = {
            "id_manga": form.path_segment_manga.data,
            "path_segment_manga": form.path_segment_manga.data,
            "title_manga": form.title_manga.data,
            "descript_manga": form.descript_manga.data,
            "poster_upload": poster_upload,
            "poster_original": poster_original,
            "detail_manga": form.detail_manga.data,
            "categories": form.categories.data,
            "chapters": form.chapters.data,
            "rate": "0",
            "views_original": "0",
            "status": form.status.data,
            "author": form.author.data,
            "id_server": id_server,
            "user_name": profile.name_user,
            "id_user": id_user,
            "role": profile.role,
        }
        return (
            jsonify(
                {"manga_update": manga_update, "message": "Update manga successfully"}
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# delete manga


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


# get comment chapter manga
def get_comment_chapter(path_segment_manga, path_segment_chapter):
    try:
        manga = List_Manga.query.filter_by(
            path_segment_manga=path_segment_manga
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
            .filter_by(
                path_segment_manga=path_segment_manga,
                path_segment_chapter=path_segment_chapter,
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
                    "like_count": like_count,
                    "time_comment": comment.time_comment,
                    "is_edited_comment": comment.is_edited_comment,
                    "replied_comment": [],
                }
                result.append(data)
        print(result)
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
                    "like_count": like_count,
                    "content": comment.content,
                    "time_comment": comment.time_comment,
                    "is_edited_comment": comment.is_edited_comment,
                }
            for data in result:
                if data["id_comment"] == comment.reply_id_comment:
                    data["replied_comment"].append(replied_comment)

        return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500


# create comment
def create_comment_chapter(path_segment_manga, path_segment_chapter):
    form = CommentsForm()
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        profile = Profiles.query.filter_by(id_user=id_user).first()

        manga = List_Manga.query.filter_by(
            path_segment_manga=path_segment_manga
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
                    {"data": responses, "message": "New comment added successfully"}
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
        manga = List_Manga.query.filter_by(
            path_segment_manga=path_segment_manga
        ).first()
        if manga is None:
            return jsonify({"message": "Manga not found"}), 404

        if form.validate_on_submit():
            content = form.content.data

            path_segment_chapter = "None"

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
            responses = {
                "id_user": id_user,
                "id_comment": comment.id_comment,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "chapter": path_segment_chapter,
                "content": content,
                "time_comment": convert_time(time),
            }
            return jsonify(responses=responses)
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
            return jsonify(responses=responses)
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
        return jsonify({"message": "Comment deleted successfully"}), 200
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
                return jsonify({"message": "Unliked Comment  successfully"}), 200
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
def search_manga():
    try:
        key = request.args.get("search")
        limit = 10
        if key:
            result = (
                db.session.query(List_Manga, Manga_Update)
                .join(Manga_Update)
                .filter(List_Manga.title_manga.ilike(f"%{key}%"))
                .order_by(Manga_Update.time_release.desc())
                .limit(limit)
                .all()
            )
            manga_list = []
            for manga in result:

                data = {
                    "id_manga": manga.List_Manga.id_manga,
                    "title": manga.List_Manga.title_manga,
                    "description": manga.List_Manga.descript_manga,
                    "poster": manga.List_Manga.poster_original,
                    "categories": manga.List_Manga.categories,
                    "rate": manga.List_Manga.rate,
                    "views": manga.List_Manga.views_original,
                    "status": manga.List_Manga.status,
                    "time": manga.Manga_Update.time_release,
                    "author": manga.List_Manga.author,
                }
                manga_list.append(data)
            if result is None:
                return jsonify({"message": "Manga does not exist!"}), 404
            return jsonify(manga_list)
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
        limit = 49
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
                path_segment_manga = manga.List_Manga.path_segment_manga
                link_manga = make_link(
                    localhost, f"/{index}/rmanga/{path_segment_manga}"
                )
                data = {
                    "id_manga": link_manga,
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
                }
                result.append(data)

            return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({"errMsg": "Internal Server Error", "errCode": str(e)}), 500
