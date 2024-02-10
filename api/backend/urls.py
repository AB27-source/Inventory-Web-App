from django.urls import path
from django.contrib import admin
from rest_framework_simplejwt.views import TokenRefreshView

from inventory.views import InventoryItemAPIView, CategoryAPIView, InventoryUpdateRequestAPIView
from user_authentication import views as authentication_views

base_url = 'api/v1'

urlpatterns = [
    path('admin/', admin.site.urls),

    # Inventory Items
    path(f'{base_url}/inventory/items/', InventoryItemAPIView.as_view(), name='inventory_items'),
    path(f'{base_url}/inventory/items/<int:item_id>/', InventoryItemAPIView.as_view(), name='inventory_item_detail'),
    path(f'{base_url}/inventory/items/category/<str:category_name>/', InventoryItemAPIView.as_view(), name='inventory_items_by_category'),

    # Categories
    path(f'{base_url}/inventory/categories/', CategoryAPIView.as_view(), name='categories'),
    path(f'{base_url}/inventory/categories/<int:category_id>/', CategoryAPIView.as_view(), name='category_detail'),

    # Inventory Update Requests
    path(f'{base_url}/inventory/requests/', InventoryUpdateRequestAPIView.as_view(), name='inventory_requests'),
    path(f'{base_url}/inventory/requests/<int:request_id>/', InventoryUpdateRequestAPIView.as_view(), name='inventory_request_detail'),

    # User Authentication 
    path(f'{base_url}/auth/register/', authentication_views.RegisterView.as_view(), name='register'),
    path(f'{base_url}/auth/email-verify/', authentication_views.VerifyEmail.as_view(), name='email-verify'),
    path(f'{base_url}/auth/login/', authentication_views.LoginAPIView.as_view(), name='login'),
    path(f'{base_url}/auth/logout/', authentication_views.LogoutAPIView.as_view(), name="logout"),
    path(f'{base_url}/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(f'{base_url}/auth/request-reset-email/', authentication_views.RequestPasswordResetEmail.as_view(), name="request-reset-email"),
    path(f'{base_url}/auth/password-reset/<uidb64>/<token>/', authentication_views.PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path(f'{base_url}/auth/password-reset-complete', authentication_views.SetNewPasswordAPIView.as_view(), name='password-reset-complete'),
]
