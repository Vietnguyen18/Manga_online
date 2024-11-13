from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Profiles(db.Model):
    __tablename__ = "profiles"
    id_user = db.Column(db.Integer, db.ForeignKey("users.id_user"), primary_key=True)
    name_user = db.Column(db.String(250), unique=True)
    avatar_user = db.Column(
        db.String(250),
        default="https://i.ibb.co/3vgb8bW/c6e56503cfdd87da299f72dc416023d4-736x620.jpg",
    )
    participation_time = db.Column(db.String(250))
    number_reads = db.Column(db.Integer, default=0)
    number_comments = db.Column(db.Integer, default=0)
    date_of_birth = db.Column(db.Text)
    gender = db.Column(db.String(11), default="undisclosed")
    introduction = db.Column(db.Text)
    job = db.Column(db.Text)
    role = db.Column(db.Boolean, nullable=False)
