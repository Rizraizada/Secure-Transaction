import face_recognition
from flask import Flask, request, jsonify
import os
import cv2
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash, check_password_hash
import secrets  # For generating secure random tokens

# Database configuration (replace with your actual credentials)
db_url = 'sql:///secure_transaction.db'  # Change to your database connection string
engine = create_engine(db_url)
Base = declarative_base()

# User model with improved security (passwords are hashed)
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    password_hash = Column(String(128), nullable=False)
    photo = Column(String(255), nullable=False)  # Path to user's image

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)


# Create database tables if they don't exist
Base.metadata.create_all(engine)

# Session factory for database interactions
Session = sessionmaker(bind=engine)
session = Session()

app = Flask(__name__)


def load_known_encoding(username):
    """Loads the face encoding of the specified user from the database."""
    user = session.query(User).filter_by(username=username).first()
    if user and user.photo:
        known_image_path = user.photo
        known_image = face_recognition.load_image_file(known_image_path)
        known_encoding = face_recognition.face_encodings(known_image)[0]
        return known_encoding
    else:
        return None  # Handle case where user not found or no photo available


@app.route('/verify', methods=['POST'])
def verify_face():
    # Validate user credentials (assuming they're sent in the request body)
    try:
        username = request.json['username']
        password = request.json['password']
    except KeyError:
        return jsonify({"error": "Missing username or password in request body"}), 400

    user = session.query(User).filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Access webcam
    cap = cv2.VideoCapture(0)  # 0 for default camera

    while True:
        ret, frame = cap.read()

        # Detect faces in the frame
        rgb_frame = frame[:, :, ::-1]  # Convert BGR to RGB for face_recognition
        face_locations = face_recognition.face_locations(rgb_frame)

        # Process each detected face
        for (top, right, bottom, left) in face_locations:
            # Extract the face image from the frame
            face_image = frame[top:bottom, left:right]

            # Encode the face
            face_encoding = face_recognition.face_encodings(face_image)[0]

            # Try to find a matching user in the database
            known_encoding = load_known_encoding(username)

            if known_encoding is not None:
                # Compare the face encoding to the known encoding
                results = face_recognition.compare_faces([known_encoding], face_encoding)

                # Display results (optional)
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                if results[0]:
                    cv2.putText(frame, "Match", (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX,
                                1, (0, 255, 0), 2)
                else:
                    cv2.putText(frame, "Not a Match", (left + 6, bottom - 6), cv
