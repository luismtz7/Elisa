import os
from jwcrypto import jwk
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configurar conexión a la base de datos con variables de entorno
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

cur = conn.cursor()

# Crear tabla si no existe
cur.execute(
    """
    CREATE TABLE IF NOT EXISTS jwt_keys (
        id SERIAL PRIMARY KEY,
        private_key TEXT NOT NULL,
        public_key TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """
)

# Generar claves
key = jwk.JWK.generate(kty='RSA', size=2048)
private_key = key.export_private()
public_key = key.export_public()

# Insertar las claves en la base de datos
cur.execute(
    sql.SQL("INSERT INTO jwt_keys (private_key, public_key) VALUES (%s, %s)"),
    [private_key, public_key]
)

# Confirmar cambios
conn.commit()

# Cerrar conexión
cur.close()
conn.close()

print("Claves privada y pública guardadas en la base de datos.")
