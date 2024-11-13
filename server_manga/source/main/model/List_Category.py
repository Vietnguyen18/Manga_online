from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class List_Category(db.Model):
    __tablename__ = "List_Category"
    category_name = db.Column(db.String(500), primary_key=True)
    description = db.Column(db.Text)
    image = db.Column(db.Text)
