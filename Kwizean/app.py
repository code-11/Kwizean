import json
import os
from flask import Flask
from flask import request
from flask_cors import CORS
from server.database.db_config import setup_db, db_clean_init, User, Restaurant, Review
from sqlalchemy import func, desc, text
import jwt


def response(success, msg, code, content_type):
    return json.dumps({'success': success, 'message': msg}), code, content_type


def create_app():
    app = Flask(__name__, static_folder='static')
    setup_db(app)
    CORS(app)

    # Only need to do this once?
    # db_clean_init()

    @app.route("/api/updatereview", methods=['POST'])
    def update_review():
        content_type = {'ContentType': 'application/json'}
        review_id = request.json.get("id")
        rating = request.json.get("rating")
        date = request.json.get("date")
        content = request.json.get("content")
        matching_review = Review.query.filter_by(id=review_id).first()
        if matching_review is None:
            return response(False, "No review with that ID", 400, content_type)
        else:
            matching_review.kz_update(date, rating, content)
            return json.dumps({'success': True}), 200, content_type

    @app.route("/api/deletereview", methods=['POST'])
    def delete_review():
        content_type = {'ContentType': 'application/json'}
        review_id = request.json.get("reviewId")
        matching_review = Review.query.filter_by(id=review_id).first()
        if matching_review is None:
            return response(False, "No restaurant with that ID", 400, content_type)
        else:
            matching_review.delete()
            return json.dumps({'success': True}), 200, content_type

    @app.route("/api/getreviews", methods=['POST'])
    def get_reviews():
        content_type = {'ContentType': 'application/json'}
        restaurant_id = request.json.get("restaurantId")
        if request.method == 'POST':
            all_reviews = Review.query.filter_by(restaurant_id=restaurant_id) \
                .join(User, User.id == Review.user_id) \
                .add_columns(User.first_name, User.last_name) \
                .order_by(Review.visit_date.desc()) \
                .all()

            def rev_tup_to_dict(rev_tup):
                rev, first_name, last_name = rev_tup
                rev_dict = rev.to_dict()
                rev_dict["userFullName"] = first_name + " " + last_name
                return rev_dict

            data = list(map(rev_tup_to_dict, all_reviews))
            return json.dumps({'success': True, 'data': data}), 200, content_type
        else:
            return response(False, "Wrong request type", 405, content_type)

    @app.route('/api/getspecialreviews')
    def get_special_reviews():
        content_type = {'ContentType': 'application/json'}
        # TODO: I'm fairly sure this, or something like it, should work.
        # I think I'm just running into problems with Model vs Session calling syntax.
        # qry = Review.query(func.max(Review.rating).label("max_score"),
        #                     func.min(Review.rating).label("min_score"),
        #                     )
        # res = qry.one()
        # max = res.max_score
        # min = res.min_score

        restaurant_id = request.json.get("restaurantId")

        # Oh well, lets just sort it out on the back end.
        all_reviews = Review.query.filter_by(id=restaurant_id).all()
        max_rating_review = max(all_reviews, key=lambda review: review.rating)
        min_rating_review = min(all_reviews, key=lambda review: review.rating)

        newest_review = Review.query.order_by(Review.visit_date.desc()).first()

        max_user = User.query.filter_by(id=max_rating_review.user_id).first()
        min_user = User.query.filter_by(id=min_rating_review.user_id).first()
        newest_user = User.query.filter_by(id=newest_review.user_id).first()

        max_dict = max_rating_review.to_dict()
        min_dict = min_rating_review.to_dict()
        newest_dict = newest_review.to_dict()

        max_dict["userFullName"] = max_user.full_name()
        min_dict["userFullName"] = min_user.full_name()
        newest_dict["userFullName"] = newest_user.full_name()

        data = {'maxRatingReview': max_dict, 'minRatingReview': min_dict, 'newestReview': newest_dict}
        return json.dumps({'success': True, 'data': data}), 200, content_type

    @app.route('/api/addreview', methods=['POST'])
    def add_review():
        content_type = {'ContentType': 'application/json'}
        restaurant_id = request.json.get("restaurantId")
        user_id = request.json.get("userId")
        rating = request.json.get("rating")
        date = request.json.get("date")
        content = request.json.get("content")
        matching_restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
        matching_user = User.query.filter_by(id=user_id).first()
        if matching_restaurant is None or matching_user is None:
            return response(False, "Could not find connections", 400, content_type)
        else:
            new_review = Review(date, rating, content, restaurant_id, user_id)
            new_review.insert()
            return json.dumps({'success': True}), 200, content_type

    @app.route('/api/updaterestaurantdetails', methods=['POST'])
    def update_restaurant():
        content_type = {'ContentType': 'application/json'}
        restaurant_id = request.json.get("id")
        name = request.json.get("name")
        location = request.json.get("location")
        description = request.json.get("description")
        matching_restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
        if matching_restaurant is None:
            return response(False, "No restaurant with that ID", 400, content_type)
        else:
            matching_restaurant.kz_update(name, location, description)
            return json.dumps({'success': True}), 200, content_type

    @app.route('/api/getrestaurantdetails', methods=['POST'])
    def get_restaurant():
        content_type = {'ContentType': 'application/json'}
        restaurant_id = request.json.get("id")

        avg_rating,num_reviews = Review.query.with_entities(func.avg(Review.rating),
                                                     func.count(Review.id)).filter_by(restaurant_id=restaurant_id).first()

        matching_restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
        if matching_restaurant is None:
            return response(False, "No restaurant with that ID", 400, content_type)
        else:
            restaurant_dict = matching_restaurant.to_dict()
            restaurant_dict["avgRating"] = float(avg_rating) if avg_rating is not None else 0
            restaurant_dict["numReviews"] = int(num_reviews) if num_reviews is not None else 0
            return json.dumps({'success': True, 'data': restaurant_dict}), 200, content_type

    @app.route('/api/getrestaurants')
    def get_restaurants():
        content_type = {'ContentType': 'application/json'}

        # We need to combine restaurants with their average score
        # select * from restaurants t1 inner join (select avg(rating), restaurant_id from reviews group by restaurant_id) t2 on t1.id=t2.restaurant_id
        # Can't quite seem to express this is sqlalchemy because of the intermediate table, so I'm going to split it into two queries and then combine when dictionaryifying them.

        # Lets get a collection of avg_ratings indexed by restaurantId
        all_avg_reviews = Review.query.with_entities(Review.restaurant_id, func.avg(Review.rating), func.count(Review.id)).group_by(Review.restaurant_id).all()
        avg_rating_table = {id: (avg_rating, num) for id, avg_rating, num in all_avg_reviews}

        # Then get all the restaurants
        all_restaurants = Restaurant.query.all()

        # Then add avg_rating to all the restaurants
        def add_rating_and_dict(restaurant):
            restaurant_dict = restaurant.to_dict()
            avg_rating, num=avg_rating_table.get(restaurant.id, (0, 0))
            restaurant_dict["avgRating"] = float(avg_rating)
            restaurant_dict["numReviews"] = num
            return restaurant_dict

        jsonified_restaurants = list(map(lambda r: add_rating_and_dict(r), all_restaurants))
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
            return response(False, "Failed to make restaurant", 405, content_type)

    @app.route('/api/deleterestaurant', methods=['POST'])
    def delete_restaurant():
        content_type = {'ContentType': 'application/json'}
        if request.method == 'POST':
            restaurant_id = request.json.get("id")
            if restaurant_id is None:
                return response(False, "Failed to delete restaurant", 400, content_type)
            else:
                matching_restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
                if matching_restaurant is None:
                    return response(False, "No restaurant with that ID", 400, content_type)
                else:
                    matching_restaurant.delete()
                    return json.dumps({'success': True}), 200, content_type
        else:
            return response(False, "Failed to delete restaurant", 405, content_type)

    @app.route('/api/updateuser', methods=['POST'])
    def update_user():
        content_type = {'ContentType': 'application/json'}
        if request.method == 'POST':
            user_id = request.json.get("userId")
            first_name = request.json.get("firstName")
            last_name = request.json.get("lastName")
            phone_number = request.json.get("phoneNumber")
            email = request.json.get("email")
            admin = request.json.get("admin", False)
            if None in [user_id, first_name, last_name, phone_number, email, admin]:
                return response(False, "Failed to update user", 400, content_type)
            else:
                matching_user = User.query.filter_by(id=user_id).first()
                if matching_user is None:
                    return response(False, "Failed to find user", 400, content_type)
                else:
                    matching_user.kz_update(admin, first_name, last_name, email, phone_number)
                    return json.dumps({'success': True}), 200, content_type
        else:
            return response(False, "Incorrect Request Method", 405, content_type)

    @app.route('/api/deleteuser', methods=['POST'])
    def delete_user():
        content_type = {'ContentType': 'application/json'}
        if request.method == 'POST':
            user_id = request.json.get("userId")
            matching_user = User.query.filter_by(id=user_id).first()
            if matching_user is None:
                return response(False, "Failed to find user", 400, content_type)
            else:
                matching_user.delete()
                return json.dumps({'success': True}), 200, content_type
        else:
            return response(False, "Incorrect Request Method", 405, content_type)

    @app.route('/api/getusers')
    def get_users():
        content_type = {'ContentType': 'application/json'}
        all_users = User.query.all()
        data = list(map(lambda user: user.to_dict(), all_users))
        return json.dumps({'success': True, "data": data}), 200, content_type

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
                    return json.dumps({'success': True, 'userId': matching_user.id}), 200, content_type
        else:
            return response(False, "Incorrect Login", 405, content_type)

    @app.route('/api/signup', methods=['POST'])
    def signup():
        content_type = {'ContentType': 'application/json'}
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
            return response(False, "Incomplete Signup", 405, content_type)

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
