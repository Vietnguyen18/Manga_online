from source import app

from source.main.function.__init__ import *

# register
app.add_url_rule("/register", methods=["POST"], view_func=register)

app.add_url_rule("/register", methods=["GET"], view_func=register_handle_get)
# comfirm register
app.add_url_rule(
    "/register/confirm/<string:token>", methods=["GET"], view_func=register_confirm
)
# login account
app.add_url_rule("/login", methods=["POST"], view_func=login)
# logout account
app.add_url_rule("/logout", methods=["POST"], view_func=jwt_required()(logout))
# change_password
app.add_url_rule(
    "/change_password/user/<int:id>",
    methods=["POST"],
    view_func=jwt_required()(change_password),
)
# fogot_password
app.add_url_rule(
    "/forgot_password",
    methods=["PATCH"],
    view_func=(forgot_password),
)
# fogot_password confirm
app.add_url_rule(
    "/forgot-password/confirm/<string:token>",
    methods=["GET"],
    view_func=(forgot_password_confirm),
)

# get list all user
app.add_url_rule(
    "/user/list_all_user",
    methods=["GET"],
    view_func=(get_all_user),
)

# get user by userid
app.add_url_rule(
    "/get_user_by_id/<int:id_user>",
    methods=["GET"],
    view_func=(get_user),
)
# get user new
app.add_url_rule(
    "/user_new",
    methods=["GET"],
    view_func=(user_new),
)
# change profile user
app.add_url_rule(
    "/change_profile_user/<int:id_user>",
    methods=["PATCH"],
    view_func=(change_profile_user),
)
# upload avatar
app.add_url_rule(
    "/image/avatar/<string:file_name>",
    methods=["GET"],
    view_func=(get_file),
)

# create_user_by_admin
app.add_url_rule("/user/create_user", methods=["POST"], view_func=create_user_by_admin)

# edit user
app.add_url_rule("/edit_user/<int:id_user>", methods=["PATCH"], view_func=edit_user)

# delete user
app.add_url_rule(
    "/delete_user/<int:id_user>",
    methods=["DELETE"],
    view_func=(delete_user),
)
# get log_user
app.add_url_rule(
    "/user/get_logUser",
    methods=["GET"],
    view_func=jwt_required()(get_log_user),
)

# get tracking user by id_user
app.add_url_rule(
    "/user/tracking_user/<id_user>",
    methods=["GET"],
    view_func=(get_tracking_user),
)


# get all tracking user
app.add_url_rule(
    "/user/all_tracking_users",
    methods=["GET"],
    view_func=(get_all_tracking_user),
)

# get info_location
app.add_url_rule(
    "/user/infor_loaction",
    methods=["GET"],
    view_func=jwt_required()(get_location_information),
)

# user activity history
app.add_url_rule(
    "/user/activity_history/<string:type>/<int:index>/<int:id_user>",
    methods=["GET", "POST", "DELETE"],
    view_func=(log_user),
)
# count user regitser
app.add_url_rule(
    "/user/count_user_regitser", methods=["GET"], view_func=count_user_register
)
