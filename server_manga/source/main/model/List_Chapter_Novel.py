from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class List_Chapter_Novel(db.Model):
    __tablename__ = "List_Chapter_Novel"
    id_chapter = db.Column(db.String(500), primary_key=True, index=True)
    id_manga = db.Column(db.String(500), db.ForeignKey("List_Manga.id_manga"))
    content_chapter = db.Column(db.Text)
    time_release = db.Column(db.Text)
    id_server = db.Column(db.Text)
