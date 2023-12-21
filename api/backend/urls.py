from django.urls import path
from django.contrib import admin

from inventory.views import InventoryItemAPIView, CategoryAPIView, InventoryUpdateRequestAPIView

base_url = 'api/v1'

urlpatterns = [
    path('admin/', admin.site.urls),

    # Inventory Items
    path(f'{base_url}/inventory/items/', InventoryItemAPIView.as_view(), name='inventory_items'),
    path(f'{base_url}/inventory/items/<int:item_id>/', InventoryItemAPIView.as_view(), name='inventory_item_detail'),

    # Categories
    path(f'{base_url}/inventory/categories/', CategoryAPIView.as_view(), name='categories'),
    path(f'{base_url}/inventory/categories/<int:category_id>/', CategoryAPIView.as_view(), name='category_detail'),

    # Inventory Update Requests
    path(f'{base_url}/inventory/requests/', InventoryUpdateRequestAPIView.as_view(), name='inventory_requests'),
    path(f'{base_url}/inventory/requests/<int:request_id>/', InventoryUpdateRequestAPIView.as_view(), name='inventory_request_detail'),

]
