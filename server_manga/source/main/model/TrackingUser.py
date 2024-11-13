from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class TrackingUser(db.Model):
    __tablename__ = "tracking_user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey("profiles.id_user"))
    login_time = db.Column(db.Text)
    login_last_time = db.Column(db.Text)
    logout_time = db.Column(db.Text)
    status = db.Column(db.Enum("online", "offline"))
    ip_login = db.Column(db.Text)
    location_login = db.Column(db.Text)
