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
from sqlalchemy import or_, extract, func
from source.main.function.middleware import *


def register():
    try:
        form = RegisterForm()
        print(
            "_______________________________________register_handle_post vao phan dang ky tai khoan_____"
        )
        print(form.email.data)
        account = Users.query.filter_by(email=form.email.data).first()
        if account:
            return jsonify({"message": "Account already exists!"}), 400
        else:
            data = {
                "email": form.email.data,
                "password": form.password.data,
                "username": form.username.data,
            }
            token = secret.dumps(data, salt=app.config["SECURITY_PASSWORD_SALT"])
            confirm_url = url_for("register_confirm", token=token, _external=True)
            msg = Message(
                "Confirmation",
                sender=app.config["MAIL_USERNAME"],
                recipients=[form.email.data],
            )
            msg.body = "Your confirmation link is " + confirm_url

            email_user = form.email.data
            password_hash = generate_password_hash(form.password.data)
            time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
            send_mail_to_email(form.email.data, confirm_url, data, form.password.data)
            user = Users(email=email_user, password=password_hash, time_register=time)
            db.session.add(user)
            db.session.commit()
            find_user = Users.query.filter_by(email=form.email.data).first()
            profile = Profiles(
                id_user=find_user.id_user,
                name_user=form.username.data,
                participation_time=convert_time(user.time_register),
                role=False,
            )
            db.session.add(profile)
            db.session.commit()
            return (jsonify({"status": 200, "message": "Check your email "})), 200
    except Exception as e:
        print("_____error___", e)
        return {"errMsg": "Something went wrong!", "errCode": str(e)}, 500


def register_handle_get():
    form = RegisterForm()
    return jsonify(errors=form.errors)


# confirm account
def register_confirm(token):
    try:
        try:
            confirmed_email = secret.loads(
                token, salt=app.config["SECURITY_PASSWORD_SALT"]
            )
        except Exception:
            return {"message": "Your link was expired. Try again"}

        account = Users.query.filter_by(email=confirmed_email["email"]).first()
        print("account", account)
        if account:
            return generate_success_message()
        else:
            email_user = confirmed_email["email"]
            password_hash = generate_password_hash(confirmed_email["password"])
            time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
            user = Users(email=email_user, password=password_hash, time_register=time)
            print("user", user)
            db.session.add(user)
            db.session.commit()
            find_user = Users.query.filter_by(email=confirmed_email["email"]).first()
            profile = Profiles(
                id_user=find_user.id_user,
                name_user=find_user.user_name,
                participation_time=convert_time(user.time_register),
                role=0,
            )
            db.session.add(profile)
            db.session.commit()
        return generate_success_message()
    except Exception as e:
        return {"errMsg": "Something went wrong!", "errCode": str(e)}, 500


# login account
def login():
    form = LoginForm()
    try:
        if form.validate_on_submit():
            account = Users.query.filter_by(email=form.email.data).first()
            # print('ID User: ', account.id_user)
            if account:
                print("Password checking ...")
                is_pass_correct = check_password_hash(
                    account.password, form.password.data
                )
                if is_pass_correct:
                    print("Password correct")
                    login_user(account)

                    # luu thoi gian, ip, location dang nhap
                    id_user = current_user.id_user
                    time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
                    # token
                    user = Profiles.query.filter(Profiles.id_user == id_user).first()
                    refresh_token = create_refresh_token(
                        identity={
                            "UserID": user.id_user,
                            "Email": form.email.data,
                            "Role": user.role,
                        }
                    )
                    access_token = create_access_token(
                        identity={
                            "UserID": user.id_user,
                            "Email": form.email.data,
                            "Role": user.role,
                        }
                    )
                    refreshtoken = RefreshTokens(
                        UserID=id_user,
                        token=refresh_token,
                        expires_at=datetime.now()
                        + app.config["JWT_REFRESH_TOKEN_EXPIRES"],
                    )

                    db.session.add(refreshtoken)
                    db.session.commit()

                    tracking = TrackingUser.query.filter_by(id_user=id_user).first()

                    ip_login = ""
                    location_ip = ""
                    try:
                        ip_login = f"{get_ip()}"
                        location_ip = f"{get_location()}"
                    except:
                        pass

                    if tracking is None:
                        data = TrackingUser(
                            id_user=id_user,
                            login_time=time,
                            login_last_time=None,
                            logout_time=None,
                            status="online",
                            ip_login=ip_login,
                            location_login=location_ip,
                        )
                        db.session.add(data)
                    else:
                        tracking.login_last_time = tracking.login_time
                        tracking.login_time = time
                        tracking.status = "online"
                        tracking.ip_login = ip_login
                        tracking.location_login = location_ip
                    db.session.commit()
                    req = jsonify(
                        {
                            "message": "Login successfully",
                            "status": 200,
                            "access_token": access_token,
                            "refresh_token": refresh_token,
                            "data": {
                                "role": user.role,
                                "id_user": user.id_user,
                                "name": user.name_user,
                                "avatar": user.avatar_user,
                                "date_of_birth": user.date_of_birth,
                                "email": form.email.data,
                                "gender": user.gender,
                            },
                        }
                    )

                    set_access_cookies(req, access_token)
                    set_refresh_cookies(req, refresh_token)
                    return req
                else:
                    return jsonify(errCode=401, message="Incorrect password!")
            else:
                return jsonify(errCode=404, message="Account does not exist!")
        else:
            return (
                jsonify(
                    {"message": "Form validation failed. Please check your input."}
                ),
                400,
            )
    except Exception as e:
        print(e)
        return (
            jsonify(
                errCode=500,
                message=f"Something went wrong!: {e}",
            )
        ), 500


# logout account
def logout():
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    try:
        print("user_id", id_user)
        logout_user()
        # luu thoi gian dang nhap
        time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
        tracking = TrackingUser.query.filter_by(id_user=id_user).first()
        tracking.logout_time = time
        tracking.status = "offline"
        db.session.commit()

        return jsonify(message=f"Sign out successful!"), 200
    except Exception as e:
        return {"errMsg": "Something went wrong!", "errCode": str(e)}, 500


# changepassword
def change_password(id):
    form = SettingPasswordForm()
    try:
        if form.validate_on_submit():
            current_password = form.current_password.data
            new_password = form.new_password.data
            confirm_password = form.confirm_password.data
            account = Users.query.get_or_404(id)

            is_password_correct = check_password_hash(
                account.password, current_password
            )
            if not is_password_correct:
                return jsonify(message="Incorrect current password"), 400
            else:
                hashed_password = generate_password_hash(new_password)
                account.password = hashed_password
                db.session.commit()
                return (
                    jsonify(
                        message="Change Password Successful",
                    )
                ), 200
        else:
            return (
                jsonify(
                    {"message": "Form validation failed. Please check your input."}
                ),
                400,
            )
    except Exception as e:
        return {"errMsg": "Something went wrong!", "errCode": str(e)}, 500


# fogot_password
def forgot_password():
    form = ForgotPasswordForm()
    if form.validate_on_submit():
        email = form.email.data
        new_password = form.new_password.data
        confirm_password = form.confirm_password.data
        try:
            account = Users.query.filter_by(email=email).first()
            data = {
                "email": email,
                "new_password": new_password,
                "confirm_password": confirm_password,
                "id_user": account.id_user,
            }
            json_data = json.dumps(data, ensure_ascii=False)
            token = secret.dumps(json_data, salt=app.config["SECURITY_PASSWORD_SALT"])
            link = url_for("forgot_password_confirm", token=token, _external=True)

            send_mail_to_email(
                account.email, link, new_password, account.email
            )  # send email by email
            return (
                jsonify(
                    {
                        "message": "Please check your email or spam",
                        "email": account.email,
                    }
                )
            ), 200
        except Exception as e:
            print("error", e)
            return jsonify({"message": "Account does not exist"}), 404
    return jsonify(error=form.errors), 400


# confirm_forgot_password
def forgot_password_confirm(token):
    try:
        confirmed = secret.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=600
        )
    except Exception:
        return jsonify({"message": "Your link was expired. Try again"}), 400
    confirmed_email = json.loads(confirmed)
    print(confirmed_email)
    hashed_password = generate_password_hash(confirmed_email["new_password"])
    account = Users.query.filter_by(id_user=confirmed_email["id_user"]).first()
    account.password = hashed_password
    db.session.commit()
    return generate_success_message()


# get user new
def user_new():
    page = request.args.get("page")
    try:
        if page is None:
            return jsonify({"message": "You forgot to pass the page field"}), 401
        limit = 20
        offset = (int(page) - 1) * limit
        users = (
            Users.query.order_by(desc(Users.time_register))
            .limit(limit)
            .offset(offset)
            .all()
        )
        data_user = []
        if users:
            for user in users:
                profile = Profiles.query.filter(
                    Profiles.id_user == user.id_user
                ).first()
                if profile:
                    data = {
                        "id_user": user.id_user,
                        "name_user": profile.name_user,
                        "avatar_user": profile.avatar_user,
                        "participation_time": convert_time(user.time_register),
                    }
                    data_user.append(data)
        return data_user
    except Exception as e:
        print(e)
        return jsonify({"message": "User does not exist"}), 404


# get all user
def get_all_user():
    list_all_user = []
    try:
        page = int(request.args.get("page", default=1))
        search = request.args.get("search", default=None)
        limit = 10
        offset = (page - 1) * limit
        total_page = 0
        user = db.session.query(Users, Profiles).join(
            Users, Profiles.id_user == Users.id_user
        )
        if search:
            search_filter = or_(
                Profiles.name_user.ilike(f"%{search}%"),
                Profiles.role.ilike(f"%{search}%"),
                Users.email.ilike(f"%{search}%"),
            )
            user = user.filter(search_filter)
        total_items = user.count()
        total_page = math.ceil(total_items / limit)
        users = (
            user.order_by(
                func.str_to_date(Users.time_register, "%H:%i:%s %d-%m-%Y").desc()
            )
            .limit(limit)
            .offset(offset)
            .all()
        )
        for account, profile in users:
            data = {
                "id_user": account.id_user,
                "email": account.email,
                "name_user": profile.name_user,
                "avatar_user": profile.avatar_user,
                "participation_time": convert_time(account.time_register),
                "number_reads": profile.number_reads,
                "number_comments": profile.number_comments,
                "date_of_birth": profile.date_of_birth,
                "gender": profile.gender,
                "introduction": profile.introduction,
                "job": profile.job,
                "role": profile.role,
            }
            list_all_user.append(data)
        return jsonify(
            {"status": 200, "list_all_user": list_all_user, "total_page": total_page}
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "User does not exist"}), 404


# get user by id
def get_user(id_user):
    account = Users.query.filter_by(id_user=id_user).first()
    profile = Profiles.query.filter_by(id_user=id_user).first()
    if profile and account:
        result = {
            "name_user": profile.name_user,
            "avatar_user": profile.avatar_user,
            "participation_time": convert_time(account.time_register),
            "number_reads": profile.number_reads,
            "number_comments": profile.number_comments,
            "date_of_birth": profile.date_of_birth,
            "gender": profile.gender,
            "introduction": profile.introduction,
            "job": profile.job,
            "role": profile.role,
        }
        return jsonify(result), 200
    else:
        return jsonify({"message": "User does not exist"}), 404


# change profile user
def change_profile_user(id_user):
    form = ChangeProfile()
    profile_user = Profiles.query.get_or_404(id_user)

    result = []
    if form.validate_on_submit():
        user = {}
        if form.name_user.data:
            profile_user.name_user = form.name_user.data
            user["nameUser"] = profile_user.name_user

        if form.date_of_birth.data:
            profile_user.date_of_birth = form.date_of_birth.data.strftime("%Y-%m-%d")
            user["dateOfBirth"] = profile_user.date_of_birth

        if form.gender.data:
            profile_user.gender = form.gender.data
            user["gender"] = profile_user.gender
        if form.introduction.data:
            profile_user.introduction = form.introduction.data
            user["introduction"] = profile_user.introduction

        if form.job.data:
            profile_user.job = form.job.data
            user["job"] = profile_user.job

        if form.avatar_user.data:
            avatar_file = form.avatar_user.data
            pic_filename = secure_filename(avatar_file.filename)
            formatted = datetime.now().strftime("%H%M%S%f-%d%m%Y")
            pic_name = f"{formatted}-{pic_filename}"
            saver = form.avatar_user.data
            saver.save(os.path.join(app.config["UPLOAD_FOLDER"], pic_name))
            image_url = split_join(request.url) + f"/image/avatar/{pic_name}"
            profile_user.avatar_user = image_url

            user["avatar"] = image_url
        result.append(user)
        if result:
            db.session.commit()
            return (
                jsonify(
                    {
                        "message": "Update profile success !",
                        "data": result,
                        "status": 200,
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": "No information updated"}), 403

    return jsonify(Error=form.errors), 400


# get image
def get_file(file_name):
    try:
        return send_from_directory(app.config["UPLOAD_FOLDER"], file_name)
    except Exception as e:
        print("error", str(exit))
        jsonify({"status": 404, "message": f"Error exception: {e}"}), 404


# create user by admin
def create_user_by_admin():
    try:
        form = CreateUserForm()
        password = "newpassword"
        account = Users.query.filter_by(email=form.email.data).first()
        if account:
            return jsonify({"message": "Account already exists!"}), 400
        else:
            email_user = form.email.data
            password_hash = generate_password_hash(password)
            time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")
            user = Users(email=email_user, password=password_hash, time_register=time)
            db.session.add(user)
            find_user = Users.query.filter_by(email=form.email.data).first()
            profile = Profiles(
                id_user=find_user.id_user,
                name_user=form.name_user.data,
                participation_time=convert_time(user.time_register),
                avatar_user=convert_path_image(form.avatar_user.data),
                date_of_birth=form.date_of_birth.data,
                gender=form.gender.data,
                introduction=form.introduction.data,
                job=form.job.data,
                role=form.role.data == "Admin",
            )
            db.session.add(profile)
        db.session.commit()
        return (
            jsonify({"status": 200, "message": " New user created successfully "})
        ), 200
    except Exception as e:
        print("_____error___", e)
        return {"errMsg": "Something went wrong!", "errCode": str(e)}, 500


# edit user
def edit_user(id_user):
    form = EditUserForm()
    profile_user = Profiles.query.get_or_404(id_user)
    try:
        if form.validate_on_submit():
            user_data = {}
            if form.name_user.data:
                profile_user.name_user = form.name_user.data
                user_data["name_user"] = profile_user.name_user

            if form.email.data:
                profile_user.email = form.email.data
                user_data["email"] = profile_user.email

            if form.role.data:
                print("role", form.role.data)
                profile_user.role = form.role.data == "Admin"
                user_data["role"] = profile_user.role

            if user_data:
                db.session.commit()
                return (
                    jsonify(
                        {
                            "message": "Edit user success !",
                            "data": user_data,
                            "status": 200,
                        }
                    ),
                    200,
                )
            else:
                return jsonify({"message": "No information user"}), 403
        else:
            return (
                jsonify(
                    {"message": "Form validation failed. Please check your input."}
                ),
                400,
            )
    except Exception as e:
        print("Error", e)
        return jsonify({"status": 404, "message": f"No {id_user} found with data"}), 404


# delete user
def delete_user(id_user):
    try:
        RefreshTokens.query.filter_by(UserID=id_user).delete()

        comments = Comments.query.filter_by(id_user=id_user).all()

        for comment in comments:
            LikesComment.query.filter_by(id_comment=comment.id_comment).delete()
            delete_reply_comment(comment)
            db.session.delete(comment)
            CommentDiary.query.filter_by(id_comment=comment.id_comment).delete()

        LogUser.query.filter_by(id_user=id_user).delete()
        TrackingUser.query.filter_by(id_user=id_user).delete()
        Profiles.query.filter_by(id_user=id_user).delete()
        Users.query.filter(Users.id_user == id_user).delete()

        db.session.commit()

        return jsonify({"message": "User deleted successfully", "status": 200}), 200

    except Exception as e:
        print("error", str(e))
        return (
            jsonify(
                {"status": 500, "message": "An error occurred while deleting the user"}
            ),
            500,
        )


# get log_user - lay thong tin hoat dong cua user
def get_log_user():
    current_user = get_jwt_identity()
    id_user = current_user.get("UserID")
    result = []

    log_user = LogUser.query.filter_by(id_user=id_user).all()
    for manga in log_user:
        infor_manga = List_Manga.query.filter_by(
            path_segment_manga=manga.path_segment_manga
        ).first()
        localhost = split_join(request.url)
        data = {
            "url_manga": make_link(localhost, f"/manga/{manga.path_segment_manga}/"),
            "title_manga": manga.title_manga,
            "categories": manga.type,
            "poster": manga.poster,
            "rate": infor_manga.rate,
            "url_chapter": make_link(
                localhost,
                f"/manga/{manga.path_segment_manga}/{manga.path_segment_chapter}",
            ),
        }
        result.append(data)

    return result


# get tracking user by id_user
def get_tracking_user(id_user):
    try:
        if id_user is None:
            return (
                jsonify({"status": 401, "message": "Please check your id_user again"}),
                401,
            )
        tracking = TrackingUser.query.filter_by(id_user=id_user).first()

        then = datetime.strptime(tracking.login_last_time, "%H:%M:%S %d-%m-%Y")
        now = datetime.now()

        time = get_time_diff(then, now)

        result = {
            "login_time": tracking.login_time,
            "logout_time": tracking.logout_time,
            "last_login_time": time,
        }

        return jsonify({"status": 200, "data": result}), 200
    except Exception as e:
        print("Error", e)
        return jsonify({"status": 404, "message": f"No {id_user} found with data"}), 404


# get all tracking user
def get_all_tracking_user():
    try:
        all_user = []
        tracking = TrackingUser.query.all()

        for user in tracking:
            if user.status == "online":
                time = get_time_diff(
                    datetime.strptime(user.login_time, "%H:%M:%S %d-%m-%Y"),
                    datetime.now(),
                )
                data = {
                    "id_user": user.id_user,
                    "status": user.status,
                    "login_time": user.login_time,
                    "online_time": time,
                    "ip_login": user.ip_login,
                    "location_login": user.location_login,
                }

            else:
                time = get_time_diff(
                    datetime.strptime(user.login_time, "%H:%M:%S %d-%m-%Y"),
                    datetime.strptime(user.logout_time, "%H:%M:%S %d-%m-%Y"),
                )
                data = {
                    "id_user": user.id_user,
                    "status": user.status,
                    "last_login_time": user.login_time,
                    "last_logout_time": user.logout_time,
                    "online_duration": time,
                    "ip_login": user.ip_login,
                    "location_ip": user.location_login,
                }

            all_user.append(data)

        return all_user
    except Exception as e:
        print("Error", e)
        return jsonify({"status": 500, "message": f"Error Exception: {str(e)}"}), 500


# get infor_location
def get_location_information():
    ip_address = get_ip()
    try:
        ip_location = DbIpCity.get(ip_address=ip_address, api_key="free")
        data = {
            "ip_address": ip_address,
            "country": ip_location.country,
            "city": ip_location.city,
            "region": ip_location.region,
            "latitude": ip_location.latitude,
            "longitude": ip_location.longitude,
        }
        return jsonify({"status": 200, "data": data}), 200
    except Exception as e:
        print("Error", e)
        return jsonify({"status": 500, "message": f"Error Exception: {str(e)}"}), 500


# user activity history
def log_user(id_user):
    if request.method == "POST":
        data = request.form
        print("_______DATA____" + str(data))
        path_segment_manga = data["path_segment_manga"]
        path_segment_chapter = data["path_segment_chapter"]
        type = data["type"]
        index = data["index"]
        if id_user == 0:
            return jsonify({"message": "login to save history"})
        user = Users.query.filter(Users.id_user == id_user).first()
        if user:
            profile = Profiles.query.filter_by(id_user=id_user).first()
            if profile:
                profile.number_reads += 1
            log_user = LogUser.query.filter_by(
                path_segment_manga=path_segment_manga,
                path_segment_chapter=path_segment_chapter,
            ).first()
            manga = List_Manga.query.filter(
                List_Manga.path_segment_manga == path_segment_manga
            ).first()
            chapter = List_Chapter.query.filter(
                List_Chapter.path_segment_chapter == path_segment_chapter,
                List_Chapter.id_manga == manga.id_manga,
            ).first()
            time = datetime.now().strftime("%Y-%m-%d")
            if manga and chapter:
                if log_user is None:
                    data = LogUser(
                        id_user=id_user,
                        title_manga=manga.title_manga,
                        path_segment_manga=path_segment_manga,
                        title_chapter=chapter.title_chapter,
                        path_segment_chapter=path_segment_chapter,
                        poster=manga.poster_original,
                        type=type,
                        index=index,
                        read_time=time,
                    )
                    db.session.add(data)
                else:
                    log_user.read_time = time
            else:
                return jsonify({"message": "chapter not found"})
            db.session.commit()
            return jsonify({"message": "History is saved"})
        else:
            return jsonify({"message": "user not found"})
    if request.method == "GET":
        try:
            result = []
            list_manga = []
            localhost = split_join(request.url)
            log_user = (
                LogUser.query.filter(LogUser.id_user == id_user)
                .order_by(LogUser.id.desc())
                .all()
            )
            for item in log_user:
                title_manga = item.title_manga
                if title_manga in list_manga:
                    continue
                else:
                    list_manga.append(title_manga)

                server = List_Server.query.filter(
                    List_Server.index == item.index
                ).first()
                name_server = server.name_server.replace("https:", "").replace("/", "")

                link_manga = make_link(
                    localhost, f"/r{item.type}/{item.path_segment_manga}"
                )
                link_chapter = make_link(
                    localhost,
                    f"/r{item.type}/{item.path_segment_manga}/{item.path_segment_chapter}",
                )

                data = {
                    "id_manga": item.path_segment_manga,
                    "title_manga": title_manga,
                    "link_manga": link_manga,
                    "title_chapter": item.title_chapter,
                    "link_chapter": link_chapter,
                    "poster": item.poster,
                    "type": item.type,
                    "index_server": item.index,
                    "name_server": name_server,
                    "readAt": item.read_time.strftime("%d/%m/%Y"),
                    "chapter": item.path_segment_chapter,
                    # 'readAt': item.read_time.strftime("%a, %d %b %Y %H:%M:%S GMT"),
                }
                result.append(data)
            return result
        except Exception as e:
            print(e)
            return jsonify({"message": f"Erorr {e}"})


# total user new register
def count_user_register():
    try:
        monthly_counts = (
            db.session.query(
                extract(
                    "year", func.str_to_date(Users.time_register, "%H:%i:%s %d-%m-%Y")
                ).label("year"),
                extract(
                    "month", func.str_to_date(Users.time_register, "%H:%i:%s %d-%m-%Y")
                ).label("month"),
                func.count(Users.id_user).label("user_count"),
            )
            .group_by(
                extract(
                    "year", func.str_to_date(Users.time_register, "%H:%i:%s %d-%m-%Y")
                ),
                extract(
                    "month", func.str_to_date(Users.time_register, "%H:%i:%s %d-%m-%Y")
                ),
            )
            .order_by(
                extract(
                    "year", func.str_to_date(Users.time_register, "%H:%i:%s %d-%m-%Y")
                ),
                extract(
                    "month", func.str_to_date(Users.time_register, "%H:%i:%s %d-%m-%Y")
                ),
            )
            .all()
        )
        month_names = [
            "",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        result = []
        for year, month, count in monthly_counts:
            result.append(
                {"year": year, "month": month_names[month], "user_count": count}
            )

        return jsonify(result)

    except Exception as e:
        print(f"Error occurred: {e}")
        return (
            jsonify({"message": f"Error: {str(e)}"}),
            500,
        )
