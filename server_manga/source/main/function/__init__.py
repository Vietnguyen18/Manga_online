from source.main.model import RefreshTokens, Users
from flask_jwt_extended import create_access_token, get_jwt_identity, set_access_cookies
import json
from urllib.request import urlopen

from flask import redirect, request, make_response, jsonify
from wtforms import SubmitField
from datetime import datetime
from source.validate_form import SwitchForm, RegisterForm
import random
import mysql.connector
from email.message import EmailMessage
from source import db, login_manager
import smtplib
from sqlalchemy import or_
from source.main.function.user import *
from source.main.function.manga import *
from source.main.function.home import *


def reader():
    return '<a href="/docs">/docs</a> to read the documentation'


def refresh_token(UserID):
    try:
        refresh_token = request.cookies.get("refresh_token_cookie")
        refreshtokens = RefreshTokens.query.filter(
            or_(RefreshTokens.UserID == UserID, RefreshTokens.token == refresh_token)
        ).first()
        token_entry = refreshtokens.token
        print(token_entry)
        currentuser = Users.query.filter(Users.id_user == UserID).first()
        user = Profiles.query.filter_by(id_user=UserID).first()
        if not refreshtokens:
            return jsonify({"message": "Invalid refresh token"}), 401
        if refreshtokens:
            if not refreshtokens or refreshtokens.expires_at < datetime.now():
                return jsonify({"Refresh token is invalid or has expired"})

            new_access_token = create_access_token(
                identity={
                    "UserID": UserID,
                    "Email": currentuser.email,
                    "Role": user.role,
                }
            )
            response = jsonify(
                {"msg": "refresh successful", "access_token": new_access_token}
            )
            set_access_cookies(response, new_access_token)
            return response
        else:
            return make_response(
                jsonify({"status": 404, "message": "token_entry not found"}), 404
            )
    except Exception as e:
        error = str(e)
        return make_response(
            jsonify(
                {
                    "Status": 500,
                    "message": "error",
                    "debugMess": error,
                }
            ),
            500,
        )
