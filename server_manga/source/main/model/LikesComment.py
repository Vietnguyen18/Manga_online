from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class LikesComment(db.Model):
    __tablename__ = "likes_comment"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_comment = db.Column(db.Integer, db.ForeignKey("comments.id_comment"))
    id_user = db.Column(db.Integer, db.ForeignKey("profiles.id_user"))
    status = db.Column(db.Enum("like", "cancel"))
