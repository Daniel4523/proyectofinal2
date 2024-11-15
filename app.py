from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)


CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}}, allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "OPTIONS", "DELETE"])


def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',
        database='usuarios',  
        user='root',          
        password=''            
    )
    if connection.is_connected():
        return connection
    else:
        return None


products = [
    {'id': 1, 'name': 'Juguete disney', 'description': 'Vehículo de 4 ruedas', 'price': 500000, 'image': 'img/carro.png', 'category': 'Juguetes'},
    {'id': 2, 'name': 'TV', 'description': 'Televisor de 50 pulgadas', 'price': 3000000, 'image': 'img/tv.png', 'category': 'electronica'},
    {'id': 3, 'name': 'Parlante', 'description': 'Parlante de alta fidelidad', 'price': 150000, 'image': 'img/parlante.jpg', 'category': 'electronica'},
    {'id': 4, 'name': 'PC', 'description': 'Computadora de escritorio', 'price': 4500000, 'image': 'img/pc.jpg', 'category': 'electronica'},
    {'id': 5, 'name': 'Nintendo', 'description': 'Consola de videojuegos', 'price': 250000, 'image': 'img/nintendo.jpeg', 'category': 'videojuegos'},
    {'id': 6, 'name': 'Xbox', 'description': 'Consola de videojuegos', 'price': 3500000, 'image': 'img/xbox.png', 'category': 'videojuegos'}
]

cart = []

@app.route('/api/products', methods=['POST'])
def add_product():
    new_product = request.get_json()

    if not all(k in new_product for k in ('id', 'name', 'description', 'price', 'image', 'category')):
        return jsonify({"error": "Faltan datos para el producto"}), 400

    products.append(new_product)
    return jsonify({"message": "Producto agregado exitosamente"}), 201

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)


@app.route('/api/cart', methods=['GET'])
def get_cart():
    return jsonify(cart)


@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    product_id = request.json.get('id')
    product = next((item for item in products if item['id'] == product_id), None)
    if product:
        cart.append(product)
        return jsonify({"message": "Producto agregado al carrito"}), 201
    return jsonify({"error": "Producto no encontrado"}), 404


@app.route('/api/cart/<int:product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    global cart
    cart = [item for item in cart if item['id'] != product_id]
    return jsonify({"message": "Producto eliminado del carrito"}), 200

@app.route('/api/change-password', methods=['POST'])
def change_password():
    data = request.get_json()

    email = data.get('email')
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        # Verificar si el usuario existe y la contraseña actual es correcta
        query = "SELECT * FROM usuarios WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if user and user['contraseña'] == old_password:
            # Cambiar la contraseña
            update_query = "UPDATE usuarios SET contraseña = %s WHERE email = %s"
            cursor.execute(update_query, (new_password, email))
            connection.commit()
            return jsonify({"message": "Contraseña cambiada exitosamente"}), 200
        else:
            return jsonify({"error": "Contraseña actual incorrecta"}), 400
    else:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('username')  
    password = data.get('password')

    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM usuarios WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if user and user['contraseña'] == password:  
            return jsonify({'user': user, 'message': 'Inicio de sesión exitoso'}), 200
        else:
            return jsonify({'message': 'Usuario o contraseña incorrectos'}), 401
    else:
        return jsonify({'message': 'Error de conexión a la base de datos'}), 500
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

  
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)

        
        query = "INSERT INTO usuarios (email, contraseña) VALUES (%s, %s)"
        cursor.execute(query, (email, password))
        connection.commit()

        return jsonify({'message': 'Usuario registrado exitosamente'}), 201
    else:
        return jsonify({'message': 'Error de conexión a la base de datos'}), 500



if __name__ == '__main__':
    app.run(debug=True)
