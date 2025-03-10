from django.shortcuts import render
from rest_framework import generics, status, views, permissions
from .serializers import (
    RegisterSerializer, SetNewPasswordSerializer, ResetPasswordEmailRequestSerializer,
    EmailVerificationSerializer, LoginSerializer, LogoutSerializer
)
from rest_framework.response import Response
from .models import User
from .utils import Util
from .renderers import UserRender
from django.urls import reverse
import jwt
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
import os
from django.http import HttpResponsePermanentRedirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

class CustomRedirect(HttpResponsePermanentRedirect):
    allowed_schemes = [os.environ.get('APP_SCHEME'), 'http', 'https']

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    # renderer_classes = (UserRender, )

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data

        user = User.objects.get(email=user_data['email'])

        token = RefreshToken.for_user(user).access_token

        frontend_url = os.environ.get('FRONTEND_URL')
        absurl = f'{frontend_url}/verify-email?token={str(token)}'
        email_body = f"""
        <center style='font-family: Arial, Helvetica, sans-serif;'>
            <h2 style='color: #344054;'>Welcome to UB Hospitality Group Inventory Management, {user.first_name} {user.last_name}</h2>
            <p>Your account is almost ready.</p>
            <a href='{absurl}' target='_blank' style="text-decoration: none;">
                <div style='margin: auto; padding: 16px 32px; background: #135DFF; border-radius: 5px; display: inline-block;'>
                    <span style='text-align: center; color: white; font-size: 16px; font-weight: 400; line-height: 24px;'>
                        Activate your Account
                    </span>
                </div>
            </a>
            <p>You can also click or paste the following link into your browser:</p>
            <a href='{absurl}' target='_blank' style='text-decoration: none; font-size: 11px; line-height: 12px; color: dodgerblue'>{absurl}</a>
            <p style='opacity: 0.60; color: #344054; font-weight: 400;'>
                If you did not request account creation on UB Hospitality Group Inventory Management, ignore this email and the account will not be created.
            </p>
            <hr style='border-width: 1px;' />
            <p style='opacity: 0.60; color: #344054; font-size: 12px;'>
                Sent by UB Hospitality Group. Reply to this email to contact us. <a href='' style='text-decoration: none; font-size: 12px; color: dodgerblue'>Unsubscribe</a>
            </p>
        </center>
        """

        data = {'email_body': email_body, 'to_email': user.email, 'email_subject': 'UB Hospitality Group Inventory Management Account Activation'}

        Util.send_email(data)

        return Response(user_data, status=status.HTTP_201_CREATED)

class VerifyEmail(views.APIView):
    serializer_class = EmailVerificationSerializer

    def get(self, request):
        token = request.GET.get('token')
        print(f"Token extracted from URL: {token}")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
            try:
                user = User.objects.get(id=payload['user_id'])
                if not user.is_verified:
                    user.is_verified = True
                    user.save()
                return CustomRedirect(f"{os.environ.get('FRONTEND_URL')}/verify-email?status=success")

            except User.DoesNotExist:
                return CustomRedirect(f"{os.environ.get('FRONTEND_URL')}/verify-email?status=user-not-found")

        except jwt.ExpiredSignatureError as e:
            return CustomRedirect(f"{os.environ.get('FRONTEND_URL')}/verify-email?status=token=expired")

        except jwt.exceptions.DecodeError as e:
            return CustomRedirect(f"{os.environ.get('FRONTEND_URL')}/verify-email?status=token=invalid")

class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        return Response({
            'tokens': user.tokens(),
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role
        }, status=status.HTTP_200_OK)

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})

            redirect_url = request.data.get('redirect_url', '')
            absurl = f'http://{current_site}{relativeLink}?redirect_url={redirect_url}'

            email_body = f"""
                <center style='font-family:Arial, Helvetica, sans-serif; text-align: center;'>
                    <tr> 
                        <td
                            style='color: #344054; font-size: 16px; font-family:inherit; font-weight: 400; line-height: 24px; word-wrap: break-word;'>
                            <br>
                            <h2 style='color: #344054;'>UB Hospitality Group Inventory Management Password Reset</h2>
                            <br />
                            Click the button below to reset your password.
                            <br /><br />
                            <a href='{absurl}' target='_blank' style="text-decoration: none;">
                                <div
                                    style='margin: auto; padding: 16px 32px; background: #135DFF; border-radius: 5px; display: inline-block;'>
                                    <span
                                        style='text-align: center; color: white; font-size: 16px; font-weight: 400; line-height: 24px;'>
                                        Reset Your Password
                                    </span>
                                </div>
                            </a>
                            <br />
                            <br />
                            <div
                                style='width: 100%; opacity: 0.60; color: #344054; font-weight: 400;'>
                                If you did not request a password reset on UB Hospitality Group Inventory Management, ignore this email.
                            </div>
                            <br />
                            <br />
                            <hr style='border-width: 1px;' />
                            <div
                                style='width: 100%; opacity: 0.60; color: #344054; font-size:12px;'>
                                Sent by United Brothers Hospitality. 
                                Reply to this email to contact us. <a href='' style='text-decoration: none; font-size:12px; color:dodgerblue'>Unsubscribe</a>
                            </div>
                        </td>
                    </tr>
                </center>
            """
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your passsword'}
            Util.send_email(data)
        return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
    
class PasswordTokenCheckAPI(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):
        redirect_url = request.GET.get('redirect_url')

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                if len(redirect_url) > 3:
                    return CustomRedirect(redirect_url + '?token_valid=False')
                else:
                    return CustomRedirect(os.environ.get('FRONTEND_URL_RESET', '') + '/?token_valid=False')

            if redirect_url and len(redirect_url) > 3:
                return CustomRedirect(redirect_url + '/?token_valid=True&message=Credentials Valid&uidb64=' + uidb64 + '&token=' + token)
            else:
                return CustomRedirect(os.environ.get('FRONTEND_URL_RESET', '') + '/?token_valid=True&message=Credentials Valid&uidb64=' + uidb64 + '&token=' + token)

        except DjangoUnicodeDecodeError as identifier:
            return CustomRedirect(redirect_url + '/?token_valid=False')

class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)

class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
