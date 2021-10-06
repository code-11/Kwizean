from flask import Flask
from flask import request
import jwt


app = Flask(__name__, static_folder='static')


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

