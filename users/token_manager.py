import datetime
from jwcrypto import jwt, jwk
from django.conf import settings
import json
import os  # Importa el modelo Manicurist desde el archivo correcto


# Asegurarse de que Django está configurado
if not settings.configured:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "esencialisa.settings")  # Cambia "tu_proyecto" por el nombre de tu proyecto
    import django
    django.setup()

class JWTManager:
    private_key = jwk.JWK(**json.loads(settings.JWT_PRIVATE_KEY))
    public_key = jwk.JWK(**json.loads(settings.JWT_PUBLIC_KEY))

    @staticmethod
    def create_tokens(user):
        now = datetime.datetime.utcnow()

        # Verificar si el usuario es un manicurista
        from manicurists.models import Manicurist  # Importa el modelo Manicurist
        try:
            manicurist = Manicurist.objects.get(usuario=user)
            manicurist_id = manicurist.id
        except Manicurist.DoesNotExist:
            manicurist_id = None  # Si no es un manicurista, el ID será null

        # Payload del token de acceso
        access_payload = {
            "sub": user.id,  # ID del usuario
            "username": user.username,
            "rol": user.rol,
            "manicurist_id": manicurist_id,  # ID del manicurista (si existe)
            "exp": int((now + datetime.timedelta(minutes=30)).timestamp()),  
            "iat": int(now.timestamp())  
        }

        # Payload del token de refresco
        refresh_payload = {
            "sub": user.id,
            "exp": int((now + datetime.timedelta(days=7)).timestamp()), 
            "iat": int(now.timestamp())  
        }

        # Crear el token de acceso
        access_token = jwt.JWT(header={"alg": "RS256"}, claims=access_payload)
        access_token.make_signed_token(JWTManager.private_key)

        # Crear el token de refresco
        refresh_token = jwt.JWT(header={"alg": "RS256"}, claims=refresh_payload)
        refresh_token.make_signed_token(JWTManager.private_key)

        return access_token.serialize(), refresh_token.serialize()

    @staticmethod
    def refresh_access_token(refresh_token):
        try:
            decoded_token = jwt.JWT(key=JWTManager.public_key, jwt=refresh_token)
            claims = json.loads(decoded_token.claims)
            user_id = claims["sub"]

            from .models import User
            user = User.objects.get(id=user_id)

            new_access_token, _ = JWTManager.create_tokens(user)
            return new_access_token
        except Exception:
            return None