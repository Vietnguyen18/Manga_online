from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class Gmail_Form(db.Model):
    __tablename__ = "gmail_from"
    id = db.Column(db.Integer, primary_key=True, index=True)
    gmail = db.Column(db.Text)
    password = db.Column(db.Text)
    password_app = db.Column(db.Text)
