from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SubmitField,
    PasswordField,
    DateField,
    SelectField,
    HiddenField,
    IntegerField,
)
from wtforms.validators import DataRequired, EqualTo, Length, Email, Regexp
from flask_wtf.file import FileField, FileRequired, FileAllowed


class RegisterForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])
    username = StringField("Username")
    submit = SubmitField("Submit")


class LoginForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Submit")


class ChangeProfile(FlaskForm):
    name_user = StringField("Name")
    date_of_birth = DateField("Date of birth", format="%d/%m/%Y")
    gender = SelectField(
        "Gender",
        choices=[
            ("female", "Female"),
            ("male", "Male"),
            ("undisclosed", "Undisclosed"),
        ],
    )
    job = StringField("Job")
    avatar_user = FileField(
        "Images",
        validators=[FileAllowed(["jpg", "png", "bmp", "jpeg"], "Images only!")],
    )
    introduction = StringField("Introduction")
    submit = SubmitField("Submit")


class SettingPasswordForm(FlaskForm):
    current_password = PasswordField("Your Password", validators=[DataRequired()])
    new_password = PasswordField(
        "New Your Password", validators=[DataRequired(), Length(min=8)]
    )
    confirm_password = PasswordField(
        "Confirm Your Password",
        validators=[
            DataRequired(),
            EqualTo("new_password", message="Passwords Must Match!"),
        ],
    )
    submit = SubmitField("Submit")


class ForgotPasswordForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    new_password = PasswordField(
        "New Your Password", validators=[DataRequired(), Length(min=8)]
    )
    confirm_password = PasswordField(
        "Confirm Your Password",
        validators=[
            DataRequired(),
            EqualTo("new_password", message="Passwords Must Match!"),
        ],
    )
    submit = SubmitField("Submit")


class CommentsForm(FlaskForm):
    content = StringField("Contents", validators=[DataRequired()])
    submit = SubmitField("Submit")


class SearchForm(FlaskForm):
    content = StringField("Content", validators=[DataRequired()])
    submit = SubmitField("Submit")


class SwitchForm(FlaskForm):
    state = SubmitField("OFF")


class NewMangaForm(FlaskForm):
    title_manga = StringField("Title", validators=[DataRequired()])
    path_segment_manga = StringField("Path", validators=[DataRequired()])
    descript_manga = StringField("Description", validators=[DataRequired()])
    poster_upload = FileField(
        "poster_upload",
        validators=[FileAllowed(["jpg", "png", "bmp", "jpeg"], "poster_upload only!")],
    )
    poster_original = FileField(
        "poster_original",
        validators=[
            FileAllowed(["jpg", "png", "bmp", "jpeg"], "poster_original only!")
        ],
    )
    detail_manga = StringField("detail_manga", validators=[DataRequired()])
    categories = StringField("categories", validators=[DataRequired()])
    chapters = StringField("chapters", validators=[DataRequired()])
    status = StringField("status", validators=[DataRequired()])
    author = StringField("author", validators=[DataRequired()])
    id_server = StringField("Id_server", validators=[DataRequired()])
    submit = SubmitField("Submit")
