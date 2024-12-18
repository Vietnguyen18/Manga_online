from source import app

from source.main.function.__init__ import *


# create new manga
app.add_url_rule(
    "/manga/create_manga_new",
    methods=["POST"],
    view_func=jwt_required()(create_manga_new),
)


# get all manga
app.add_url_rule(
    "/manga/get_all_manga/<int:index>", methods=["GET"], view_func=get_all_data
)

# management manga
app.add_url_rule(
    "/manga/filter_manga/<int:index>",
    methods=["GET"],
    view_func=filter_manga,
)

# edit manga
app.add_url_rule(
    "/manga/edit_manga/<string:path_segment_manga>",
    methods=["PATCH"],
    view_func=(edit_manga),
)

# delete manga
app.add_url_rule(
    "/manga/delete_manga/<string:path_segment_manga>/<string:path_segment_chapter>",
    methods=["DELETE"],
    view_func=(delete_manga),
)

# get list manga by path
app.add_url_rule(
    "/manga/<string:path>",
    methods=["GET"],
    view_func=get_listManga,
)

# get list novel by path
app.add_url_rule(
    "/novel/<string:path>",
    methods=["GET"],
    view_func=get_Listnovel,
)

# get image chapter manga
app.add_url_rule(
    "/manga/<string:path_segment_manga>/<string:path_segment_chapter>",
    methods=["GET"],
    view_func=get_image_chapter,
)

# get content chapter novel
app.add_url_rule(
    "/novel/<string:path_segment_manga>/<string:path_segment_chapter>",
    methods=["GET"],
    view_func=get_content_chapter,
)

# get all comment manga
app.add_url_rule(
    "/manga/all_comments/<string:path>",
    methods=["GET"],
    view_func=get_all_comment_manga,
)

# get comment chapter manga
app.add_url_rule(
    "/manga/comment_chapter/<string:path_segment_manga>/<string:path_segment_chapter>",
    methods=["GET"],
    view_func=get_comment_chapter,
)


# get comment by path
app.add_url_rule(
    "/manga/comments/<string:path_segment_manga>",
    methods=["GET"],
    view_func=get_comment_manga,
)

# create comment chapter
app.add_url_rule(
    "/manga/create_comment_chapter/<string:path_segment_manga>/<string:path_segment_chapter>",
    methods=["POST"],
    view_func=jwt_required()(create_comment_chapter),
)

# create comment
app.add_url_rule(
    "/manga/create_comment/<string:path_segment_manga>",
    methods=["POST"],
    view_func=jwt_required()(create_comment_manga),
)

# create rely_comment
app.add_url_rule(
    "/manga/create_rely_comment/<int:id_comment>",
    methods=["POST"],
    view_func=jwt_required()(create_reply_comments),
)

# delete comment
app.add_url_rule(
    "/manga/delete_comment/<int:id_comment>",
    methods=["DELETE"],
    view_func=jwt_required()(delete_comment),
)

# edit comment
app.add_url_rule(
    "/manga/edit_comment/<int:id_comment>",
    methods=["PATCH"],
    view_func=jwt_required()(edit_comments),
)


# get comment diary
app.add_url_rule(
    "/manga/comment_diary/<int:id_comment>",
    methods=["GET"],
    view_func=jwt_required()(comments_diary),
)

# like comment
app.add_url_rule(
    "/manga/like_comment/<int:id_user>/<int:id_comment>",
    methods=["POST"],
    view_func=(like_comment),
)

# get all category
app.add_url_rule(
    "/manga/get_all_category",
    methods=["GET"],
    view_func=(get_all_categories),
)

# search manga
app.add_url_rule(
    "/manga/<int:index>/search_manga",
    methods=["GET"],
    view_func=(search_manga),
)

# filter list manga by category
app.add_url_rule(
    "/manga/list_manga_by_category/<int:index>",
    methods=["GET"],
    view_func=(list_manta_by_category),
)

# views
app.add_url_rule("/manga/total_views", methods=["GET"], view_func=views_manga)

# list chapter
app.add_url_rule(
    "/manga/list_all_chapter/<string:id_manga>",
    methods=["GET"],
    view_func=list_all_chapter,
)

# list chapter
app.add_url_rule(
    "/manga/list_chapter/<string:id_manga>",
    methods=["GET"],
    view_func=list_chapter_by_id,
)
