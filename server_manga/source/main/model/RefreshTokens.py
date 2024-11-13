from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class RefreshTokens(db.Model):
    __tablename__ = "RefreshTokens"
    RefreshTokenID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(db.Integer, db.ForeignKey("users.id_user"), nullable=False)
    token = db.Column(db.String(512), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
