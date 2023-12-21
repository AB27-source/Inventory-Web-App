from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    name = models.CharField(max_length=200)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    def update_quantity(self, new_quantity, approved_by=None):
        if approved_by:
            self.quantity = new_quantity
            self.save()

    def __str__(self):
        return self.name

class InventoryUpdateRequest(models.Model):
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    requested_quantity = models.IntegerField()
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_requests')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_requests')
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Update Request for {self.item.name}"
