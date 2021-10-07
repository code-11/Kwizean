import json
import os
from flask import Flask
from flask import request
from flask_cors import CORS
from server.database.db_config import setup_db, db_clean_init, User
import jwt


def create_app():
    app = Flask(__name__, static_folder='static')
    setup_db(app)
    CORS(app)

    # Only need to do this once?
    db_clean_init()

    @app.route('/api/signup', methods=['POST'])
    def signup():
        if request.method == 'POST':
            first_name = request.json.get("firstName")
            last_name = request.json.get("lastName")
            phone_number = request.json.get("phoneNumber")
            email = request.json.get("email")
            password = request.json.get("password")
            admin = request.json.get("admin", False)
            if first_name is None or last_name is None or phone_number is None or email is None or password is None:
                return json.dumps({'success': False, 'message': "Incomplete Signup"}), 400, {
                    'ContentType': 'application/json'}

            else:
                new_user = User(first_name, last_name, email, phone_number, password, admin)
                new_user.insert()
                return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        else:
            return json.dumps({'success': False, 'message':"Incomplete Signup"}), 400, {'ContentType': 'application/json'}

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
