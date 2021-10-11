from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Boolean, Text, ForeignKey, Date
from sqlalchemy.orm import relationship

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


class Review(db.Model):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    visit_date = Column(Date)
    rating = Column(Integer)
    content = Column(Text())
    restaurant_id = Column(Integer, ForeignKey('restaurants.id'))

    def __init__(self, visit_date, rating, content, restaurant_id, user_id):
        self.visit_date = visit_date
        self.rating = rating
        self.content = content
        self.restaurant_id = restaurant_id
        self.user_id = user_id

    def to_dict(self):
        return {
            'id': self.id,
            'date': str(self.visit_date),
            'rating': self.rating,
            'content': self.content,
            'userId': self.user_id,
            'restaurantId': self.restaurant_id,
        }

    def kz_update(self, date, rating, content):
        setattr(self, 'visit_date', date)
        setattr(self, 'rating', rating)
        setattr(self, 'content', content)
        db.session.commit()

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()


class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    id = Column(Integer, primary_key=True)
    name = Column(String(80))
    location = Column(String(80))
    description = Column(Text())
    children = relationship("Review")

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

    def kz_update(self, name, location, description):
        setattr(self, 'name', name)
        setattr(self, 'location', location)
        setattr(self, 'description', description)
        db.session.commit()

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

    def full_name(self):
        return self.first_name +" "+ self.last_name

    def to_dict(self):
        # No password. We don't want to send that down!
        return {
            'id': self.id,
            'isAdmin': self.is_admin,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'phoneNumber': self.phone_number
        }

    def kz_update(self, is_admin, first_name, last_name, email, phone_number):
        setattr(self, 'is_admin', is_admin)
        setattr(self, 'first_name', first_name)
        setattr(self, 'last_name', last_name)
        setattr(self, 'email', email)
        setattr(self, 'phone_number', phone_number)
        db.session.commit()

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()
