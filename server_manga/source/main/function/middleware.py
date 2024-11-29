import os.path
from urllib.parse import urlparse
import base64
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


def make_link(localhost, path):
    url = f"{localhost}{path}"
    return url


def split_join(url):
    url = url.split("/")
    url = "/".join(url[:3])
    return url


def make_url_image(id_user, path, image, typeof):
    local_host = split_join(request.base_url)
    random_name = f"{id_user}_{typeof}_{random.randint(100000, 999999)}.jpg"
    image_link = f"/get_image/{id_user}/{random_name}"
    if not os.path.isdir(path):
        os.makedirs(path)
    else:
        user_path = os.path.join(path, str(id_user))
        if not os.path.isdir(user_path):
            os.makedirs(user_path)
            image.save(os.path.join(user_path, random_name))
        else:
            image.save(os.path.join(user_path, random_name))
    print(make_link(local_host, image_link))
    return make_link(local_host, image_link)


def fix_title_chapter(url_chapter, url_manga):
    return "Chapter " + url_chapter.lstrip(url_manga)


def convert_path_image(url):
    pic_filename = secure_filename(url.filename)
    formatted = datetime.now().strftime("%H%M%S%f-%d%m%Y")
    pic_name = f"{formatted}-{pic_filename}"
    saver = url
    saver.save(os.path.join(app.config["UPLOAD_FOLDER"], pic_name))
    image_url = split_join(request.url) + f"/image/avatar/{pic_name}/"
    return image_url


def format_number(value):
    if value >= 1_000_000:  # Hơn 1 triệu
        return f"{value / 1_000_000:.1f}M"  # Định dạng thành triệu
    elif value >= 1_000:  # Hơn 1 nghìn
        return f"{value / 1_000:.1f}K"  # Định dạng thành nghìn
    return str(value)  # Giá trị nhỏ hơn 1000, giữ nguyên


def format_with_dot(value):
    return f"{value:,}"
