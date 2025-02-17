# Usar una imagen base de Python 3.10
FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pkg-config \
    libmariadb-dev \
    libpq-dev \  
    gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar los archivos de requerimientos e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto en el que corre Django
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["gunicorn", "esencialisa.wsgi:application", "--bind", "0.0.0.0:8000"]
