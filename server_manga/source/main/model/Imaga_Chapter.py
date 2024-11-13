from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Imaga_Chapter(db.Model):
    __tablename__ = "Imaga_Chapter"
    path_segment = db.Column(db.String(500), primary_key=True)
    id_chapter = db.Column(db.String(500), db.ForeignKey("List_Chapter.id_chapter"))
    image_chapter_upload = db.Column(db.Text)
    image_chapter_original = db.Column(db.Text)
