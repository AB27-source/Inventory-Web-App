from rest_framework import permissions

class BaseRolePermission(permissions.BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in self.allowed_roles

class IsManagerOrAdmin(BaseRolePermission):
    allowed_roles = ['manager', 'admin']

class IsEmployee(BaseRolePermission):
    allowed_roles = ['employee']
