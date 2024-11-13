from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from source import db


class ServerMode(db.Model):
    __tablename__ = "Server_Mode"
    index = db.Column(db.String(500), primary_key=True)
    mode_name = db.Column(db.Text)
    status = db.Column(db.Enum("on", "off"), default="off")
