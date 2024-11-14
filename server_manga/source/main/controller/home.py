from source import app

from source.main.function.__init__ import *


# get all news
app.add_url_rule("/news/get_all_news", methods=["GET"], view_func=get_news)
# get new by idNews
app.add_url_rule(
    "/news/get_new_by_idNews/<int:id_news>",
    methods=["GET"],
    view_func=jwt_required()(get_new_by_idNews),
)
# new_release_comics
app.add_url_rule(
    "/news/new_release_comics/<int:index>/<string:type>",
    methods=["GET"],
    view_func=(new_release_comics),
)
# RECENT COMICS
app.add_url_rule(
    "/recent_comics/<int:index>/<string:type>",
    methods=["GET"],
    view_func=(recent_comics),
)

# RECOMMENDED COMICS
app.add_url_rule(
    "/recommended_comics/<int:index>/<string:type>",
    methods=["GET"],
    view_func=(recommended_comics),
)

# COOMING SOON COMICS
app.add_url_rule(
    "/cooming_soon_comics/<int:index>/<string:type>",
    methods=["GET"],
    view_func=(cooming_soon_comics),
)

# RANK WEEK
app.add_url_rule(
    "/rank_manga_week/<int:index>/<string:type>",
    methods=["GET"],
    view_func=(rank_manga_week),
)

# RANK MONTH
app.add_url_rule(
    "/rank_manga_month/<int:index>/<string:type>",
    methods=["GET"],
    view_func=(rank_manga_month),
)

# RANK YEAR
app.add_url_rule(
    "/rank_manga_year/<int:index>/<string:type>",
    methods=["GET"],
    view_func=(rank_manga_year),
)

# CURRENTLY READING by chapter
app.add_url_rule(
    "/currently_reading/<string:type>",
    methods=["GET"],
    view_func=(currently_reading),
)
