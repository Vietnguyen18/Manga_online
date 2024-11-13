from source import db, migrate
from source.main.model import *

if __name__ == "__main__":
    db.create_all()
