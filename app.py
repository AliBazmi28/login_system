import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db_host = os.environ.get('DB_HOST')
db_user = os.environ.get('DB_USER')
db_password = os.environ.get('DB_PASSWORD')
db_name = os.environ.get('DB_NAME')
db_port = os.environ.get('DB_PORT')

print("DB_HOST:", db_host)
print("DB_USER:", db_user)
print("DB_NAME:", db_name)
print("DB_PORT:", db_port)

if not all([db_host, db_user, db_password, db_name, db_port]):
    raise Exception("One or more DB environment variables are missing.")

db = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name,
    port=int(db_port)
)

db = mysql.connector.connect(
    host=os.environ['DB_HOST'],
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD'],
    database=os.environ['DB_NAME'],
    port=int(os.environ.get('DB_PORT'))
)

@app.route('/test-db')
def test_db():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users")
        result = cursor.fetchall()
        return jsonify({"success": True, "rows": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route('/login', methods =['POST'])
def login():
    data = request.get_json()
    user_id = data['id']
    password = data['password']

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id =%s AND password = %s", (user_id, password))
    result = cursor.fetchone()
    cursor.close

    if result:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})


if __name__ == '__main__':
    app.run(debug=True, port=5000)