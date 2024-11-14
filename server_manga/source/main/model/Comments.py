from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Comments(db.Model):
    __tablename__ = "comments"
    id_comment = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey("profiles.id_user"), nullable=False)
    path_segment_manga = db.Column(db.TEXT)
    path_segment_chapter = db.Column(db.TEXT)
    content = db.Column(db.TEXT)
    time_comment = db.Column(db.TEXT)
    is_comment_reply = db.Column(db.Boolean, default=False)
    reply_id_comment = db.Column(db.Integer, db.ForeignKey("comments.id_comment"))
    is_edited_comment = db.Column(db.Boolean, default=False)
