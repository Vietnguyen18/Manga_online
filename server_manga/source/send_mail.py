import json
from urllib.request import urlopen

from flask import redirect, request, make_response, jsonify
from wtforms import SubmitField
from datetime import datetime
from source.validate_form import SwitchForm, RegisterForm

from source.main.model import LogUser, TrackingUser, Gmail_Form, Users
import random
import mysql.connector
from email.message import EmailMessage
from source import db, login_manager
import smtplib


def get_data_email():
    try:
        gmail_data = db.session.query(Gmail_Form.gmail, Gmail_Form.password_app).all()
        # Choose a random row from gmail_data
        data = random.choice(gmail_data)
        print(str(data))
        return data
    except Exception as error:
        print(f"Error Exception: {error}")
        return make_response(
            jsonify({"status": 500, "error": f"Error Exception: {error}"})
        )


def send_mail_to_email(email, link, user_name, device_register):
    try:
        print("_____Bắt đầu gửi email_____")

        MainData_body = f""" 
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Confirmation Notification</title>
        <!-- Add Bootstrap CSS from CDN -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            .card {{
                max-width: 900px; /* Increase card width */
                width: 100%;
            }}
            .card-img-top {{
                width: 100%; /* Make the image responsive */
                height: 350px; /* Set fixed height for the image */
                object-fit: cover; /* Ensure the image is cropped correctly */
            }}
        </style>
    </head>
    <body class="d-flex align-items-center justify-content-center" style="min-height: 100vh;">

    <div class="card shadow-lg">
        <img src="https://raw.githubusercontent.com/Vietnguyen18/nguyenducviet/main/image/email-mail-delivery-internet-illustration-application-icon-many_428451_wh860.png" alt="Banner" class="card-img-top rounded-top">

        <div class="card-body text-center">
            <h2 class="card-title mb-4">Welcome, <span class="text-primary">{user_name}</span></h2>
            
            <p class="mb-3">
                You requested to create a Manga Online account. To complete the process, please confirm your email by clicking the button below.
            </p>
            <p>
                By confirming, you will enhance the security of your account and ensure that you own this email.
            </p>
            
            <a href={link} class="btn btn-primary px-4 py-2 mt-3">Confirm Email</a>
            
            <div class="mt-5 text-muted">
                <p>Best regards,<br>Nguyen Duc Viet Team</p>
            </div>
        </div>
    </div>

    </body>
    </html>
    """
        print("_____truoc_khi_guimail_____")
        data = get_data_email()
        print(data[0], [data[1]])

        msg = EmailMessage()
        msg["Subject"] = "Verify Account Manga Online"
        msg["From"] = "thinkdiff92@gmail.com"
        msg["To"] = email
        msg.set_content(
            f"""\
            {MainData_body} + {user_name}
        """,
            subtype="html",
        )
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.ehlo()
        server.login(data[0], data[1])
        server.send_message(msg)

        server.close()
    except Exception as e:
        print("An error occurred while sending the email:")
        print(str(e))
        print(email, link, user_name, device_register)
        return str(e)


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


def generate_success_message():
    # HTML và Bootstrap để hiển thị thông báo thành công
    html_content = f"""
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Registration Success</title>
            <!-- Thêm Bootstrap từ CDN -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <!-- Thêm font awesome cho icon -->
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
            <style>
                .confirmation-container {{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    flex-direction: column;
                    text-align: center;
                }}
                .confirmation-icon {{
                    font-size: 60px;
                    color: green;
                    margin-bottom: 20px;
                }}
                .confirmation-message {{
                    font-size: 20px;
                    color: #333;
                    margin-bottom: 20px;
                }}
                .btn-custom {{
                    background-color: #007bff;
                    color: white;
                }}
            </style>
        </head>
        <body>
            <div class="confirmation-container">
                <!-- Icon dấu tích -->
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <!-- Nội dung thông báo -->
                <div class="confirmation-message">
                    Account successfully registered
                </div>
                <div class="confirmation-message">
                    Congratulations, you are successfully registered!
                </div>
                <!-- Nút chuyển hướng -->
                <a href="http://127.0.0.1:7979/" class="btn btn-custom">
                    Try to login.
                </a>
            </div>

            <!-- Thêm Bootstrap và các script cần thiết -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    """
    return html_content
