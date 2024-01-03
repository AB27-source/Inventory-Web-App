from django.core.mail.backends.smtp import EmailBackend
import smtplib

class CustomEmailBackend(EmailBackend):
    def open(self):
        if self.connection:
            return False
        try:
            self.connection = smtplib.SMTP(self.host, self.port, timeout=self.timeout)
            self.connection.ehlo('localhost')
            if self.use_tls:
                self.connection.starttls(context=self.ssl_context)
                self.connection.ehlo('localhost')
            self.connection.login(self.username, self.password)
            return True
        except:
            if not self.fail_silently:
                raise
