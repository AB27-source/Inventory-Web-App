from rest_framework import serializers
from .models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.exceptions import AuthenticationFailed
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode


class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default=User.EMPLOYEE)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'role']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)
    
    class Meta:
        model = User
        fields = ['token']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    tokens = serializers.SerializerMethodField()
    role = serializers.CharField(source='user.role', read_only=True)

    def get_tokens(self, obj):
        user = User.objects.get(email=obj['email'])
        return user.tokens()

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        user = User.objects.filter(email=email).first()
        
        if user and user.check_password(password):
            if not user.is_active:
                raise AuthenticationFailed('Account disabled, contact admin')
            if not user.is_verified:
                raise AuthenticationFailed('Email is not verified')
            return {
                'email': user.email,
                'tokens': user.tokens(),
                'user': user,
                'role': user.role
            }
        raise AuthenticationFailed('Invalid credentials, try again')


class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)
    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return user
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_message = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')
