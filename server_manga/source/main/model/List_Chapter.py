from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class List_Chapter(db.Model):
    __tablename__ = "List_Chapter"
    id_chapter = db.Column(db.String(500), primary_key=True, index=True)
    title_chapter = db.Column(db.Text)
    path_segment_chapter = db.Column(db.Text)
    id_manga = db.Column(db.String(500), db.ForeignKey("List_Manga.id_manga"))
    time_release = db.Column(db.Text)
