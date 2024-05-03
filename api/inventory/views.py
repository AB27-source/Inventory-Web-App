from rest_framework import status, views
from rest_framework.response import Response
from .models import InventoryItem, Category, InventoryUpdateRequest
from .serializers import InventoryItemSerializer, CategorySerializer, InventoryUpdateRequestSerializer
from .permissions import IsManagerOrAdmin
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone

class InventoryItemAPIView(views.APIView):
    serializer_class = InventoryItemSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, item_id=None, category_name=None):
        # Case when an item_id is provided for detail view
        if item_id:
            try:
                item = InventoryItem.objects.get(id=item_id)
                serializer = self.serializer_class(item)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except InventoryItem.DoesNotExist:
                return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        # Case when category_name is provided for filtering
        elif category_name:
            category = get_object_or_404(Category, name=category_name)
            items = InventoryItem.objects.filter(category=category)
            serializer = self.serializer_class(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Default case, list all items
        else:
            items = InventoryItem.objects.all()
            serializer = self.serializer_class(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    User = get_user_model()
    
    def put(self, request, item_id):
        item = get_object_or_404(InventoryItem, id=item_id)
        print(f"User: {request.user}, Role: {getattr(request.user, 'role', 'Unknown')}")

        # Determine if the user is an employee
        if request.user.role == 'employee':
            # Prepare data for creating an inventory update request
            update_data = {
                'item': item.id,
                'requested_quantity': request.data.get('quantity'),
                # Note: `submitted_by` is set automatically in the view, as it's read-only in the serializer
            }
            serializer = InventoryUpdateRequestSerializer(data=update_data, context={'request': request})
            
            if serializer.is_valid():
                update_request = serializer.save(submitted_by=request.user)
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If the user is not an employee (i.e., a manager or admin), proceed with the update as usual
            serializer = self.serializer_class(item, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryAPIView(views.APIView):
    serializer_class = CategorySerializer

    def get(self, request, category_id=None):
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                serializer = self.serializer_class(category)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Category.DoesNotExist:
                return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        categories = Category.objects.all()
        serializer = self.serializer_class(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InventoryUpdateRequestAPIView(views.APIView):
    serializer_class = InventoryUpdateRequestSerializer

    def get(self, request, request_id=None):
        if request_id:
            try:
                update_request = InventoryUpdateRequest.objects.get(id=request_id)
                serializer = self.serializer_class(update_request)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except InventoryUpdateRequest.DoesNotExist:
                return Response({"error": "Update request not found"}, status=status.HTTP_404_NOT_FOUND)

        update_requests = InventoryUpdateRequest.objects.all()
        serializer = self.serializer_class(update_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(submitted_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, request_id):
        update_request = get_object_or_404(InventoryUpdateRequest, id=request_id)
        action = request.data.get('action', '').lower()

        if action in ['approve', 'reject']:
            if not request.user.role in ['manager', 'admin']:
                return Response({"error": "Unauthorized. Only managers or admins can approve or reject requests."}, status=status.HTTP_403_FORBIDDEN)

            update_request.status = action
            update_request.approved_by = request.user
            update_request.approved_at = timezone.now()

            if action == 'approve':
                # Applying changes from the update request to the item
                inventory_item = update_request.item
                inventory_item.quantity = update_request.requested_quantity
                inventory_item.save()

            update_request.save()
            return Response({"message": f"Inventory update request {action}d."}, status=status.HTTP_200_OK)

        # If not approving or rejecting, proceed with a regular update
        serializer = self.serializer_class(update_request, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, request_id):
        try:
            update_request = InventoryUpdateRequest.objects.get(id=request_id)
        except InventoryUpdateRequest.DoesNotExist:
            return Response({"error": "Update request not found"}, status=status.HTTP_404_NOT_FOUND)

        update_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InventoryRequestActionAPIView(views.APIView):
    permission_classes = [IsManagerOrAdmin]

    def post(self, request, request_id, action):
        try:
            update_request = InventoryUpdateRequest.objects.get(id=request_id, status='pending')
        except InventoryUpdateRequest.DoesNotExist:
            return Response({"error": "Update request not found or not in pending status"}, status=status.HTTP_404_NOT_FOUND)
        
        if action == "approve":
            # Applying changes from the update request to the item
            inventory_item = update_request.item
            inventory_item.quantity = update_request.requested_quantity
            inventory_item.save()

            update_request.status = 'approved'
            update_request.approved_by = request.user  # Set the approver
            update_request.approved_at = timezone.now()  # Recording the approval time
            update_request.save()

            return Response({"message": "Inventory update request approved and changes applied."}, status=status.HTTP_200_OK)

        elif action == "reject":
            update_request.status = 'rejected'
            update_request.approved_by = request.user  # Recording rejection
            update_request.approved_at = timezone.now()  # Record the rejection time
            update_request.save()

            return Response({"message": "Inventory update request rejected."}, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Invalid action specified."}, status=status.HTTP_400_BAD_REQUEST)