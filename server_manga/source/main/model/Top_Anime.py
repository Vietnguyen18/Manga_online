from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Top_Anime(db.Model):
    __tablename__ = "Top_Anime"
    id_anime = db.Column(db.String(500), primary_key=True)
    name_anime = db.Column(db.Text)
    score = db.Column(db.Text)
    descript_pro = db.Column(db.Text)
    ranked = db.Column(db.Text)
    popularity = db.Column(db.Text)
    poster = db.Column(db.Text)
    genres = db.Column(db.Text)
