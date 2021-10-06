from flask import Flask
from flask import request
import jwt


app = Flask(__name__, static_folder='static')


@app.route('/favicon.ico')
def icon():
    return app.send_static_file('./favicon.ico')

@app.route('/bundle.js')
def bundle():
    return app.send_static_file('./bundle.js')

@app.route('/')
def root():
    return app.send_static_file("./index.html")

