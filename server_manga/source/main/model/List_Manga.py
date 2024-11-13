from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class List_Manga(db.Model):
    __tablename__ = "List_Manga"
    id_manga = db.Column(db.String(500), primary_key=True, index=True)
    path_segment_manga = db.Column(db.Text)
    title_manga = db.Column(db.Text)
    descript_manga = db.Column(db.Text)
    poster_upload = db.Column(db.Text)
    poster_original = db.Column(db.Text)
    detail_manga = db.Column(db.Text)
    categories = db.Column(db.Text)
    chapters = db.Column(db.Text)
    rate = db.Column(db.Text)
    views_original = db.Column(db.Text)
    status = db.Column(db.Text)
    author = db.Column(db.Text)
    comments = db.Column(db.Text)
    id_server = db.Column(db.Text)
