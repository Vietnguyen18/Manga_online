from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Reviews_Top_Anime(db.Model):
    __tablename__ = "Reviews_Top_Anime"
    id_reviews = db.Column(db.String(500), primary_key=True)
    id_anime = db.Column(db.String(500))
    user = db.Column(db.Text)
    avatar_user = db.Column(db.Text)
    profile_user_reviews = db.Column(db.Text)
    content_reviews = db.Column(db.Text)
    time_reviews = db.Column(db.Text)
