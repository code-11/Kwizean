# Kwizean
A basic restaurant reviewing SPA

How to Build:
  -Download repo
  -Frontend is in Kwizean\static. In this folder is a package.json. Call npm install, then webpack to bundle things.
  -Backend is in Kwizean\app.py and Kwizean\server. In pycharm, set module name to 'flask' and parameter name to 'run'. Add the following options as environment variables:
    PYTHONUNBUFFERED=1; FLASK_ENV=development; FLASK_DEBUG=1, then just hit run.
  -Running the database requires installation on postgres. The application expects the dbpassword to be an environment variable called KWIZEAN_DB_PASS.
  -Runs on 127.0.0.1:5000 and api is /api

Features:
  -Supports two different User types: user and admin
  -Users can view restaurants and create reviews
  -Users receive curated views of reviews
  -Admin can Add/Edit/Delete the following:
    -Restaurants
    -Reviews
    -Users
    
Technical 
  -Front end is made using react and semantic UI
  -Back end is made using python
  -Server is flask
  -ORM is sql alchemy
  -Database is postgres
  
