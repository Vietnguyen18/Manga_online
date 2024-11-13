from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Reviews_Manga(db.Model):
    __tablename__ = "Reviews_Manga"
    idReview = db.Column(db.String(500), primary_key=True)
    noi_dung = db.Column(db.Text)
    link_manga = db.Column(db.Text)
    link_avatar_user_comment = db.Column(db.Text)
    link_user = db.Column(db.Text)
    time_review = db.Column(db.Text)
