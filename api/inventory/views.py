from rest_framework import status, views
from rest_framework.response import Response
from .models import InventoryItem, Category, InventoryUpdateRequest
from .serializers import InventoryItemSerializer, CategorySerializer, InventoryUpdateRequestSerializer

class InventoryItemAPIView(views.APIView):
    serializer_class = InventoryItemSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, item_id=None):
        if item_id:
            try:
                item = InventoryItem.objects.get(id=item_id)
                serializer = self.serializer_class(item)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except InventoryItem.DoesNotExist:
                return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        items = InventoryItem.objects.all()
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, item_id):
        try:
            item = InventoryItem.objects.get(id=item_id)
        except InventoryItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, item_id):
        try:
            item = InventoryItem.objects.get(id=item_id)
        except InventoryItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, request_id):
        try:
            update_request = InventoryUpdateRequest.objects.get(id=request_id)
        except InventoryUpdateRequest.DoesNotExist:
            return Response({"error": "Update request not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(update_request, data=request.data)
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