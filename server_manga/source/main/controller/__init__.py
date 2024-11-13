from source import app

from source.main.function.__init__ import *
from source.main.controller.user import *

app.add_url_rule("/", view_func=reader)
app.add_url_rule(
    "/refresh_token/<int:UserID>", methods=["POST"], view_func=refresh_token
)
