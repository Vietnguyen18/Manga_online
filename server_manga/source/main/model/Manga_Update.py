from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Manga_Update(db.Model):
    __tablename__ = "Manga_Update"
    id_manga = db.Column(
        db.String(500), db.ForeignKey("List_Manga.id_manga"), primary_key=True
    )
    title_manga = db.Column(db.Text)
    id_chapter = db.Column(db.String(500), db.ForeignKey("List_Chapter.id_chapter"))
    title_chapter = db.Column(db.Text)
    path_segment_manga = db.Column(db.Text)
    path_segment_chapter = db.Column(db.Text)
    time_release = db.Column(db.Text)
    poster = db.Column(db.Text)
    categories = db.Column(db.Text)
    rate = db.Column(db.Text)
    views_week = db.Column(db.Integer, default=0)
    views_month = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
