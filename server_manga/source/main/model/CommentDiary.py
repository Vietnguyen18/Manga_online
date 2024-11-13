from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class CommentDiary(db.Model):
    __tablename__ = "comment_diary"
    id_comment_diary = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_comment = db.Column(db.Integer)
    content = db.Column(db.Text)
    comment_type = db.Column(db.Enum("before", "after", "delete"))
    time_comment = db.Column(db.Text)
