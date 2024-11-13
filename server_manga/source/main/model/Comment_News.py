from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Comment_News(db.Model):
    __tablename__ = "Comment_News"
    id_comment = db.Column(db.String(500), primary_key=True)
    id_news = db.Column(db.String(500))
    user_comment = db.Column(db.Text)
    profile_user_comment = db.Column(db.Text)
    comment = db.Column(db.Text)
    time_comment = db.Column(db.Text)
