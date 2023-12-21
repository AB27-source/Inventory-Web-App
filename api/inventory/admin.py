from django.contrib import admin
from django.utils import timezone
from .models import Category, InventoryItem, InventoryUpdateRequest

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'quantity', 'price', 'category']
    list_filter = ['category']
    search_fields = ['name']
    actions = ['update_quantities']

@admin.register(InventoryUpdateRequest)
class InventoryUpdateRequestAdmin(admin.ModelAdmin):
    list_display = ['item', 'requested_quantity', 'status', 'submitted_by', 'approved_by', 'created_at', 'approved_at']
    list_filter = ['status', 'created_at']
    actions = ['approve_requests', 'reject_requests']

    def approve_requests(self, request, queryset):
        for update_request in queryset.filter(status='pending'):
            update_request.item.update_quantity(update_request.requested_quantity, request.user)
            update_request.status = 'approved'
            update_request.approved_by = request.user
            update_request.approved_at = timezone.now()
            update_request.save()
    approve_requests.short_description = "Approve selected requests"

    def reject_requests(self, request, queryset):
        queryset.filter(status='pending').update(status='rejected', approved_by=request.user, approved_at=timezone.now())
    reject_requests.short_description = "Reject selected requests"
