from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_employee(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', User.EMPLOYEE)
        return self.create_user(email, password, **extra_fields)

    def create_manager(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', User.MANAGER)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    EMPLOYEE = 'employee'
    MANAGER = 'manager'
    ADMIN = 'admin'
    FRONTDESK = 'front desk'
    HOUSEKEEPING = 'housekeeping'
    MAINTENANCE = 'maintenance'

    ROLE_CHOICES = [
        (EMPLOYEE, 'Employee'),
        (MANAGER, 'Manager'),
        (ADMIN, 'Admin'),
        (FRONTDESK, 'Front Desk'),
        (HOUSEKEEPING, 'Housekeeping'),
        (MAINTENANCE, 'Maintenance'),
    ]
    first_name = models.CharField(max_length=150, default='')
    last_name = models.CharField(max_length=150, default='')
    email = models.EmailField(max_length=255, unique=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(max_length=12, choices=ROLE_CHOICES, default=EMPLOYEE)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    def has_inventory_permission(self):
        return self.role in {self.MANAGER, self.ADMIN}
