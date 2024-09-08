import face_recognition
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sqlalchemy import Column, Integer, String, create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from PIL import Image
import requests
import os
from sqlalchemy.exc import OperationalError

# Import the engine from your database config
from config.database import engine  

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    photo = Column(String(255), nullable=False)  # Path to user's image or URL

# Create database tables if they don't exist
Base.metadata.create_all(engine)

# Session factory for database interactions
Session = sessionmaker(bind=engine)
session = Session()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def check_database_connection():
    """Check if the database connection is successful."""
    try:
        with engine.connect() as connection:
            # Execute a simple query to check the connection
            connection.execute(text("SELECT 1"))
            print("Database connection successful")
            return True
    except OperationalError as e:
        print(f"Database connection failed: {e}")
        return False

def load_known_encoding(user_id):
    """Loads the face encoding of the specified user from the database."""
    try:
        user = session.query(User).filter_by(id=user_id).first()  # Query by user_id
        if user and user.photo:
            known_image_path = user.photo
            print(f"Loading image for user ID '{user_id}' from path: {known_image_path}")

            # Check if the photo field is a URL
            if known_image_path.startswith('http'):
                # Download the image
                response = requests.get(known_image_path)
                response.raise_for_status()  # Raise an error for bad status codes

                # Save the image to a temporary file
                temp_image_path = os.path.join('temp_images', f'{user_id}.png')
                os.makedirs(os.path.dirname(temp_image_path), exist_ok=True)

                with open(temp_image_path, 'wb') as f:
                    f.write(response.content)

                # Load the image using face_recognition
                known_image = face_recognition.load_image_file(temp_image_path)
                print(f"Image downloaded and saved to {temp_image_path}")
                os.remove(temp_image_path)  # Clean up the temporary file
            else:
                # Add 'public/' to the path to ensure correct resolution
                known_image_path = os.path.join('public', known_image_path)
                
                # Load the image from the specified path
                known_image = face_recognition.load_image_file(known_image_path)
                print(f"Image loaded from path: {known_image_path}")

            known_encoding = face_recognition.face_encodings(known_image)
            if known_encoding:
                return known_encoding[0]
            else:
                print(f"No face encodings found for the image of user ID '{user_id}'")
                return None
        else:
            print(f"User with ID '{user_id}' not found or has no photo")
            return None
    except Exception as e:
        print(f"Error loading known encoding for user ID '{user_id}': {e}")
        return None


@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        # Fetch 'user_id' from query parameters
        user_id = request.args.get('user_id')
        if user_id is None:
            return jsonify({"status": "fail", "error": "User ID not provided"}), 400

        image_data = request.files.get('image')
        if image_data is None:
            return jsonify({"status": "fail", "error": "Image file not provided"}), 400
        print(f"Received image data for user ID '{user_id}'")

        # Process the image data
        image = Image.open(image_data.stream).convert('RGB')  # Ensure the image is in RGB format
        image_np = np.array(image)

        # Detect faces in the frame
        face_locations = face_recognition.face_locations(image_np)

        if not face_locations:
            return jsonify({"status": "fail", "error": "No face detected"}), 400

        # Extract face encodings
        face_encodings = face_recognition.face_encodings(image_np, face_locations)

        if len(face_encodings) == 0:
            return jsonify({"status": "fail", "error": "Face encoding failed"}), 400

        face_encoding = face_encodings[0]

        # Load the user's encoding from the database using user_id
        known_encoding = load_known_encoding(user_id)
        if known_encoding is None:
            return jsonify({"status": "fail", "error": "User has no registered photo"}), 400

        # Compare the face encoding with the known encoding
        matches = face_recognition.compare_faces([known_encoding], face_encoding)

        if matches[0]:
            return jsonify({"status": "success", "message": "Face verified!"})
        else:
            return jsonify({"status": "fail", "error": "Face does not match registered user"})

    except Exception as e:
        # If an exception occurs, return an error response and log the error
        print(f"Error during face verification: {e}")
        return jsonify({"status": "error", "error": str(e)}), 500

if __name__ == '__main__':
    if check_database_connection():
        app.run(debug=True, port=5000)
    else:
        print("Unable to connect to the database. Exiting application.")
