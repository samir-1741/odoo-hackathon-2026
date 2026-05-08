from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, get_db_connection

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# ✅ Test Route - Check if server is running
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Odoo Hackathon API Running!", "status": "success"})

# ✅ GET - Fetch all items
@app.route('/api/items', methods=['GET'])
def get_items():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM items').fetchall()
    conn.close()
    return jsonify([dict(item) for item in items])

# ✅ POST - Add new item
@app.route('/api/items', methods=['POST'])
def add_item():
    data = request.get_json()

    # Validate input
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400

    conn = get_db_connection()
    conn.execute('INSERT INTO items (name, description) VALUES (?, ?)',
                 (data['name'], data.get('description', '')))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item added successfully!"}), 201

# ✅ DELETE - Remove item
@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item deleted!"})

if __name__ == '__main__':
    init_db()  # Create tables on start
    app.run(debug=True, port=5000)
