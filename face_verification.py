import face_recognition
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from PIL import Image
from io import BytesIO
from config.database import engine  # Import the engine from your database config
import requests
import os

Base = declarative_base()

# User model without password hashing
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

def load_known_encoding(username):
    """Loads the face encoding of the specified user from the database."""
    try:
        user = session.query(User).filter_by(id=username).first()  # Changed to use user ID
        if user and user.photo:
            known_image_path = user.photo

            # Check if the photo field is a URL
            if known_image_path.startswith('http'):
                # Download the image
                response = requests.get(known_image_path)
                response.raise_for_status()  # Raise an error for bad status codes

                # Save the image to a temporary file
                temp_image_path = os.path.join('temp_images', f'{username}.png')
                os.makedirs(os.path.dirname(temp_image_path), exist_ok=True)

                with open(temp_image_path, 'wb') as f:
                    f.write(response.content)

                # Load the image using face_recognition
                known_image = face_recognition.load_image_file(temp_image_path)
            else:
                # Load the image from a local path
                known_image = face_recognition.load_image_file(known_image_path)

            known_encoding = face_recognition.face_encodings(known_image)[0]
            return known_encoding
        else:
            return None  # Handle case where user not found or no photo available
    except Exception as e:
        print(f"Error loading known encoding for {username}: {e}")
        return None

@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        username = request.args.get('username')
        image_data = request.files['image']

        # Log the received image data
        print("Received image data:", image_data)

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

        known_encoding = load_known_encoding(username)  # Load user's encoding from database

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
    app.run(debug=True, port=5000)
