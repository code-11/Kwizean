import json
import os
from flask import Flask
from flask import request
from flask_cors import CORS
from server.database.db_config import setup_db, db_clean_init, User, Restaurant
import jwt


def response(success, msg, code, content_type):
    return json.dumps({'success': success, 'message': msg}), code, content_type

def create_app():
    app = Flask(__name__, static_folder='static')
    setup_db(app)
    CORS(app)

    # Only need to do this once?
    # db_clean_init()

    @app.route('/api/getrestaurants')
    def get_restaurants():
        content_type = {'ContentType': 'application/json'}
        all_restaurants = Restaurant.query.all()
        jsonified_restaurants = list(map(lambda r: r.to_dict(), all_restaurants))
        return json.dumps({'success': True, 'data': jsonified_restaurants}), 200, content_type

    @app.route('/api/createrestaurant', methods=['POST'])
    def create_restaurant():
        content_type = {'ContentType': 'application/json'}
        if request.method == 'POST':
            name = request.json.get("name")
            location = request.json.get("location")
            description = request.json.get("description")
            if name is None or location is None or description is None:
                return response(False, "Failed to make restaurant", 400, content_type)
            else:
                new_restaurant = Restaurant(name, location, description)
                new_restaurant.insert()
                return json.dumps({'success': True}), 200, content_type
        else:
            return response(False, "Failed to make restaurant", 400, content_type)

    @app.route('/api/login', methods=['POST'])
    def login():
        content_type = {'ContentType': 'application/json'}
        if request.method == 'POST':
            email = request.json.get("email")
            password = request.json.get("password")
            admin = request.json.get("admin", False)
            if email is None or password is None:
                return response(False, "Incorrect Login", 400, content_type)
            else:
                matching_user = User.query.filter_by(email=email, password=password, is_admin=admin).first()
                if matching_user is None:
                    return response(False, "Incorrect Login", 403, content_type)
                else:
                    return json.dumps({'success': True}), 200, content_type
        else:
            return response(False, "Incorrect Login", 400, content_type)

    @app.route('/api/signup', methods=['POST'])
    def signup():
        content_type={'ContentType': 'application/json'}
        if request.method == 'POST':
            first_name = request.json.get("firstName")
            last_name = request.json.get("lastName")
            phone_number = request.json.get("phoneNumber")
            email = request.json.get("email")
            password = request.json.get("password")
            admin = request.json.get("admin", False)
            if first_name is None or last_name is None or phone_number is None or email is None or password is None:
                return response(False, "Incomplete Signup", 400, content_type)

            else:
                new_user = User(first_name, last_name, email, phone_number, password, admin)
                new_user.insert()
                return json.dumps({'success': True}), 200, content_type
        else:
            return response(False, "Incomplete Signup", 400, content_type)

    @app.route('/icons/kwizeanFull105.png')
    def block105():
        return app.send_static_file('./static/icons/kwizeanFull105.png')

    @app.route('/favicon.ico')
    def icon():
        return app.send_static_file('./static/icons/kwizeanBlock105.png')

    @app.route('/bundle.js')
    def bundle():
        return app.send_static_file('./bundle.js')

    @app.route('/')
    def root():
        return app.send_static_file("./index.html")

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='127.0.0.1', port=port, debug=True)
