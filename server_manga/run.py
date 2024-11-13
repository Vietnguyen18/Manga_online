from source.main.controller import *
from source import db
from source import socketIo, app, migrate


if __name__ == "__main__":
    socketIo.run(app, host="0.0.0.0", port=7979)
