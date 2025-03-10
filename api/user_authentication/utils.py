from django.core.mail import EmailMessage, send_mail
from django.utils.html import strip_tags
import os
import threading


class EmailThread(threading.Thread):

    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email


class Util:

    @staticmethod
    def send_email(data):
        plain_message = strip_tags(data['email_body'])
        EmailThread(
            send_mail(subject=data['email_subject'],
                          message=plain_message,
                          from_email=os.environ.get('OUTLOOK_EMAIL'),
                          recipient_list=[data['to_email']],
                          html_message=data['email_body'],
                          fail_silently=False
                          )
                ).start()