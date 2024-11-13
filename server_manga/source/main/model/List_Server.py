from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class List_Server(db.Model):
    __tablename__ = "List_Server"
    index = db.Column(db.String(500), primary_key=True)
    name_server = db.Column(db.Text)
    image_lang = db.Column(db.Text)
