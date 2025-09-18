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
    recommended_quantity = serializers.IntegerField(required=False, min_value=0, default=0)
    warning_quantity = serializers.IntegerField(required=False, min_value=0, default=0) 

    class Meta:
        model = InventoryItem
        fields = (
            "id",
            "name",
            "quantity",
            "price",
            "category",
            "last_updated",
            "recommended_quantity",
            "warning_quantity",
        )

    # def get_category(self, obj):
    #     return obj.category.name

    def validate(self, data):
        quantity = data.get('quantity', getattr(self.instance, 'quantity', 0))
        recommended = data.get('recommended_quantity', getattr(self.instance, 'recommended_quantity', 0))
        warning = data.get('warning_quantity', getattr(self.instance, 'warning_quantity', 0))

        if quantity < 0:
            raise serializers.ValidationError(
                {"quantity": "Quantity cannot be negative."}
            )

        if recommended < 0:
            raise serializers.ValidationError(
                {"recommended_quantity": "Recommended quantity cannot be negative."}
            )

        if warning < 0:
            raise serializers.ValidationError(
                {"warning_quantity": "Warning quantity cannot be negative."}
            )

        if warning > recommended:
            raise serializers.ValidationError(
                {"warning_quantity": "Warning quantity cannot exceed the recommended quantity."}
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

