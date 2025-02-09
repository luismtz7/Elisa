from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .models import User
from .token_manager import JWTManager
import jwt

class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Acción personalizada para registrar un nuevo usuario
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario registrado con éxito"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Acción personalizada para iniciar sesiónñ
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Autenticar al usuario
        user = authenticate(username=username, password=password)
        if user:
            # Crear tokens de acceso y refresco
            access_token, refresh_token = JWTManager.create_tokens(user)
            return Response({"access_token": access_token, "refresh_token": refresh_token})
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    # Acción personalizada para refrescar el token de acceso
    @action(detail=False, methods=["post"])
    def refresh_token(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Aquí deberías agregar la lógica para validar y refrescar el token
        # Por ejemplo, decodificar el refresh token y generar un nuevo access token
        # Esto es solo un ejemplo y debe ser implementado según tus necesidades
        try:
            # Decodificar el refresh token
            decoded_refresh_token = jwt.JWT(key=JWTManager.public_key, jwt=refresh_token)
            user_id = decoded_refresh_token.claims.get("sub")
            user = User.objects.get(id=user_id)
            
            # Crear un nuevo access token
            access_token, _ = JWTManager.create_tokens(user)
            return Response({"access_token": access_token})
        except Exception as e:
            return Response({"error": "Refresh token inválido o expirado"}, status=status.HTTP_401_UNAUTHORIZED)
