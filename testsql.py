import psycopg2

try:
    conn = psycopg2.connect(
        dbname="elisa_db_dev",
        user="luismartinez",
        password="lm17052019",
        host="localhost",
        port="5432"
    )
    print("Conexión exitosa!")
    conn.close()
except Exception as e:
    print(f"Error: {e}")