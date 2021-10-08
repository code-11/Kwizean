from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Boolean, Text

db = SQLAlchemy()
'''
setup_db(app):
    binds a flask application and a SQLAlchemy service
'''


def setup_db(app):
    database_name = 'kwizean_db'
    default_database_path = "postgresql://{}:{}@{}/{}".format('postgres', 'firesky1', 'localhost:5432', database_name)
    # database_path = os.getenv('DATABASE_URL', default_database_path)
    app.config["SQLALCHEMY_DATABASE_URI"] = default_database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)


def db_clean_init():
    # print("hello world")
    db.drop_all()
    db.create_all()


class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    id = Column(Integer, primary_key=True)
    name = Column(String(80))
    location = Column(String(80))
    description = Column(Text())

    def __init__(self, name, location, description):
        self.name = name
        self.location = location
        self.description = description

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'description': self.description,
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()


class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    is_admin = Column(Boolean)
    first_name = Column(String(80))
    last_name = Column(String(80))
    email = Column(String(80))
    phone_number = Column(String(14))
    password = Column(String(80))

    def __init__(self, first_name, last_name, email, phone_number, password, is_admin=False):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone_number = phone_number
        self.password = password
        self.is_admin = is_admin

    def to_dict(self):
        return {
            'id': self.id,
            'is_admin': self.is_admin,
            'firstName': self.title,
            'lastName': self.release_date,
            'email': self.email,
            'phoneNumber': self.phone_number,
            'password': self.password
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()
