from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SubmitField,
    PasswordField,
    DateField,
    SelectField,
    HiddenField,
    IntegerField,
    BooleanField,
)
from wtforms.validators import (
    DataRequired,
    EqualTo,
    ValidationError,
    Length,
    Email,
    Regexp,
)
from flask_wtf.file import FileField, FileRequired, FileAllowed
import re

# class RegisterForm(FlaskForm):
#     email = StringField("Email", validators=[DataRequired(), Email()])
#     password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])
#     username = StringField("Username")
#     submit = SubmitField("Submit")


class RegisterForm(FlaskForm):
    email = StringField(
        "Email",
        validators=[
            DataRequired(message="Email is required"),
            Email(message="Invalid email format"),
        ],
    )
    password = PasswordField(
        "Password",
        validators=[
            DataRequired(message="Password is required"),
            Length(min=8, message="Password must be at least 8 characters"),
        ],
    )
    username = StringField("Username")
    submit = SubmitField("Submit")

    def validate_email(self, field):
        """Custom email validation for additional constraints."""
        allowed_domains = ["example.com", "test.com"]
        email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_pattern, field.data):
            raise ValidationError("Email does not match the required pattern.")
        domain = field.data.split("@")[-1]
        if domain not in allowed_domains:
            raise ValidationError(
                f"Email domain must be one of the following: {', '.join(allowed_domains)}"
            )


class LoginForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Submit")


class ChangeProfile(FlaskForm):
    name_user = StringField("Name")
    date_of_birth = DateField("Date of birth", format="%Y-%m-%d")
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
    descript_manga = StringField("Description", validators=[DataRequired()])
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
    submit = SubmitField("Submit")


class EditUserForm(FlaskForm):
    name_user = StringField("name", validators=[DataRequired()])
    email = StringField("email", validators=[DataRequired(), Email()])
    role = SelectField(
        "role",
        choices=[("Member", "False"), ("Admin", "True")],
        validators=[DataRequired()],
    )
    submit = SubmitField("Submit")


class CreateUserForm(FlaskForm):
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
    email = StringField("email", validators=[DataRequired(), Email()])
    avatar_user = FileField(
        "Images",
        validators=[FileAllowed(["jpg", "png", "bmp", "jpeg"], "Images only!")],
    )
    role = SelectField(
        "role",
        choices=[("Member", "False"), ("Admin", "True")],
        validators=[DataRequired()],
    )
    introduction = StringField("Introduction")
    submit = SubmitField("Submit")
