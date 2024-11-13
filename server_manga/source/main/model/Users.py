from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Users(db.Model, UserMixin):
    __tablename__ = "users"
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(250), nullable=False, unique=True)
    password = db.Column(db.String(250), nullable=False)
    time_register = db.Column(db.String(250), nullable=False)
    web_reading_mode_status = db.Column(db.Enum("on", "off"), default="off")

    def get_id(self):
        return self.id_user
