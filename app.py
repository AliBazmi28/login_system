import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Clean DB_PORT value
raw_port = os.environ.get('DB_PORT', '21391')
clean_port = ''.join(filter(str.isdigit, raw_port))
port = int(clean_port)

print("DB_USER:", os.environ.get("DB_USER"))


# Fetch DB credentials
db_host = os.environ.get('DB_HOST')
db_user = os.environ.get('DB_USER')
db_password = os.environ.get('DB_PASSWORD')
db_name = os.environ.get('DB_NAME')
db_port = port

# Check for missing env vars
if not all([db_host, db_user, db_password, db_name, db_port]):
    raise Exception("One or more DB environment variables are missing.")

# Connect to DB
db = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name,
    port=db_port
)

# Route for testing DB connection
@app.route('/test-db')
def test_db():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users")
        result = cursor.fetchall()
        return jsonify({"success": True, "rows": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/login', methods=['GET']) # type: ignore
def login_page():
    return render_template('index.html')

# Route for login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_id = data.get('id')
    password = data.get('password')


    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s AND password = %s", (user_id, password))
    result = cursor.fetchone()
    cursor.close()

    if result:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})

# Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
