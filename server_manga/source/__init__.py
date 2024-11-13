import json
import math
from bs4 import BeautifulSoup
import requests
from functools import cmp_to_key
from flask import Flask, request, jsonify, send_from_directory, url_for, session
from flask_caching import Cache
from flask_cors import CORS
from flask_mail import *
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from itsdangerous import URLSafeTimedSerializer

from sqlalchemy import JSON, cast, FLOAT, func, desc
from datetime import datetime, timedelta, timezone

from urllib.parse import unquote
from threading import Thread
import imgbbpy, os

from ip2geotools.databases.noncommercial import DbIpCity
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_jwt_extended import JWTManager
import base64
from flask_socketio import SocketIO
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import set_access_cookies
from flask_sslify import SSLify
from flask_login import (
    LoginManager,
    login_user,
    login_required,
    logout_user,
    current_user,
)
from flask_migrate import Migrate


app = Flask(__name__)
CORS(app)
cors = CORS(app)
app.wsgi_app = ProxyFix(app.wsgi_app)


# yeu cau cors
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response


app.config["SECRET_KEY"] = "24580101357999"
app.config["SECURITY_PASSWORD_SALT"] = "24580201357999"
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://ducviet:Ducviet%4018@localhost/Manga?charset=utf8mb4"
)

app.config["SQLAlCHEMY_TRACK_MODIFICATIONS"] = False
app.config["WTF_CSRF_ENABLED"] = False

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = "thinkdiff92@gmail.com"
app.config["MAIL_PASSWORD"] = "Mothaiba123@"
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True
app.config["JSON_AS_ASCII"] = False
app.config["JSON_SORT_KEYS"] = False
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True

jwt = JWTManager(app)


UPLOAD_FOLDER = r"/media/ducviet/Individual/Pictures/image_manga"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

cache = Cache(config={"CACHE_TYPE": "SimpleCache"})
cache.init_app(app)

secret = URLSafeTimedSerializer(app.config["SECRET_KEY"])
mail = Mail(app)

connected_clients = []
app.app_context().push()
mail = Mail(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
# socketIo = SocketIO(app, cors_allowed_origins="*")
# viet fix loi epoll 26 sep 2024
socketIo = SocketIO(
    app,
    cors_allowed_origins="*",
    max_http_buffer_size=1024 * 1024 * 50,
    logger=True,
    engineio_logger=True,
    async_mode="threading",
)
path_folder_images = "/media/ducviet/Individual/Pictures/image_manga"
key_api_imgbb = f"687aae62e4c9739e646a37fca814c1bc"
