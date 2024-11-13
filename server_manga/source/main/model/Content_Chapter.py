from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Content_Chapter(db.Model):
    __tablename__ = "Content_Chapter"
    path_segment = db.Column(db.String(500), primary_key=True)
    id_chapter = db.Column(db.String(500))
    content_chapter = db.Column(db.Text)
