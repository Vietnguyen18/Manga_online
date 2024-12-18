from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class LogUser(db.Model):
    __tablename__ = "log_user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey("profiles.id_user"))
    title_manga = db.Column(db.Text)
    path_segment_manga = db.Column(db.Text)
    title_chapter = db.Column(db.Text)
    path_segment_chapter = db.Column(db.Text)
    poster = db.Column(db.Text)
    type = db.Column(db.Text)
    index = db.Column(db.Integer)
    read_time = db.Column(db.Text)
