from rest_framework import serializers
from .models import InventoryItem, Category, InventoryUpdateRequest

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class InventoryItemSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
            queryset=Category.objects.all(),
            slug_field='name',
            required=True
        )
    name = serializers.CharField(required=True)
    quantity = serializers.IntegerField(required=True)
    price = serializers.DecimalField(required=True, max_digits=10, decimal_places=2)

    class Meta:
        model = InventoryItem
        fields = (
            "id",
            "name",
            "quantity",
            "price",
            "category",
            "last_updated",
        )

    # def get_category(self, obj):
    #     return obj.category.name

    def validate(self, data):
        if data['quantity'] < 0:
            raise serializers.ValidationError(
                {"quantity": "Quantity cannot be negative."}
            )

        return data

class InventoryUpdateRequestSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=InventoryItem.objects.all())
    submitted_by_username = serializers.ReadOnlyField(source='submitted_by.email')
    submitted_by_first_name = serializers.ReadOnlyField(source='submitted_by.first_name')
    submitted_by_last_name = serializers.ReadOnlyField(source='submitted_by.last_name')
    approved_by = serializers.ReadOnlyField(source='approved_by.username')

    class Meta:
        model = InventoryUpdateRequest
        fields = [
            'id', 'item', 'requested_quantity', 'submitted_by_username', 
            'submitted_by_first_name', 'submitted_by_last_name',
            'approved_by', 'status', 'created_at', 'approved_at'
        ]

