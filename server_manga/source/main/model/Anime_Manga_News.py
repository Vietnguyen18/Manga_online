from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Anime_Manga_News(db.Model):
    __tablename__ = "Anime_Manga_News"
    idNews = db.Column(db.String(500), primary_key=True)
    time_news = db.Column(db.Text)
    category = db.Column(db.Text)
    title_news = db.Column(db.Text)
    profile_user_post = db.Column(db.Text)
    images_poster = db.Column(db.Text)
    descript_pro = db.Column(db.Text)
    number_comment = db.Column(db.Integer)
