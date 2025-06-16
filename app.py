import os
from flask_cors import CORS
from flask import Flask, request, jsonify, render_template, redirect
import mysql.connector
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5000", "http://localhost:5000"])

# Clean DB_PORT value
raw_port = os.environ.get('DB_PORT', '21391')
clean_port = ''.join(filter(str.isdigit, raw_port))
port = int(clean_port)

# Fetch DB credentials
db_host = os.environ.get('DB_HOST')
db_user = os.environ.get('DB_USER')
db_password = os.environ.get('DB_PASSWORD')
db_name = os.environ.get('DB_NAME')
db_port = port

# Check for missing env vars
if not all([db_host, db_user, db_password, db_name, db_port]):
    raise Exception("One or more DB environment variables are missing.")

# Function to create new DB connection
def get_db_connection():
    return mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name,
        port=db_port
    )

# ================= ROUTES ===================

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')

    data = request.get_json()
    first = data.get('firstName')
    last = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO users (id, first_name, last_name, password) VALUES (%s, %s, %s, %s)",
            (email, first, last, password)
        )
        db.commit()
        return jsonify({"success": True, "redirect": "/login"})
    except mysql.connector.IntegrityError:
        return jsonify({"success": False, "error": "User already exists"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        try:
            cursor.close()
            db.close()
        except:
            pass


@app.route('/')
def index():
    return redirect('/login')


@app.route('/home')
def home():
    user_id = request.args.get("id")
    return render_template('home.html', user_id=user_id)


@app.route('/apply', methods=['GET'])
def apply():
    user_id = request.args.get("id")
    return render_template('apply.html', user_id=user_id)


@app.route('/submit-application', methods=['POST'])
def submit_application():
    data = request.get_json()

    user_id = data.get('user_id')
    first_name = data.get('first_name')
    middle_name = data.get('middle_name')
    last_name = data.get('last_name')
    enrollment = data.get('enrollment')
    cnic = data.get('cnic')
    phone = data.get('phone')
    dob = data.get('dob')
    course = data.get('course')
    semester = data.get('semester')
    address = data.get('address')
    gpa = data.get('gpa')
    percentage = data.get('percentage')

    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO applications (
                user_id, first_name, middle_name, last_name,
                enrollment_number, cnic, phone, dob,
                course, semester, address, gpa, percentage
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            user_id, first_name, middle_name, last_name,
            enrollment, cnic, phone, dob,
            course, semester, address, gpa, percentage
            ))
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        try:
            cursor.close()
            db.close()
        except:
            pass


@app.route('/test-db')
def test_db():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users")
        result = cursor.fetchall()
        return jsonify({"success": True, "rows": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        try:
            cursor.close()
            db.close()
        except:
            pass


@app.route('/login', methods=['GET'])
def login_page():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_id = data.get('id')
    password = data.get('password')

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE id = %s AND password = %s", (user_id, password))
        result = cursor.fetchone()
        if result:
            return jsonify({"success": True, "redirect": f"/home?id={user_id}"})
        else:
            return jsonify({"success": False})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        try:
            cursor.close()
            db.close()
        except:
            pass


# Run app
if __name__ == '__main__':
    app.run(debug=False, port=5000, host='0.0.0.0')
