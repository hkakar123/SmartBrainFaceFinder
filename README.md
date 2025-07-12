# Smart Brain App 

Smart Brain is a fullstack web application that detects faces in images. Users upload images through the frontend, and the backend processes these images using the Clarifai API to find faces and draw bounding boxes around them. 

---

## Features 

- 🔐 User Authentication: Users can register and log in to keep track of the amount of images they have uploaded
- 📸 Face Detection: Uses Clarifai's powerful machine learning API to detect faces in images.
- 🖼️ Bounding Boxes:  Automatically draws boxes around detected faces for clear visualization.
- 🚀 Real-time Processing: Fast detection powered by a Node.js + Express.js backend.
- 🌐 Modern Frontend: Responsive and simple HTML, CSS, and JavaScript interface for easy user interaction.
- 🗄️ Database Support: Uses PostgreSQL to securely store user data and image submissions.


---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Face Detection API:** Clarifai API
- **Database:** PostgreSQL
- **Deployment:** Render.com for both backend and frontend services

---

## How It Works

1. Users register and log in to create an account.
2. The user uploads an image via the frontend interface.
3. The frontend sends the image URL or data to the backend API.
4. The backend sends the image to the Clarifai API for face detection.
5. Clarifai API returns the coordinates of detected faces.
6. The backend passes this data to the frontend.
7. The frontend draws bounding boxes around each detected face for visualization.
8. User data and image submissions are stored and tracked in PostgreSQL.

---

## Deployment

- **Frontend** is deployed as a static site (served directly via Render).
- **Backend** is deployed as a web service (Node.js + Express app on Render).
- **Database** is hosted on Render’s managed PostgreSQL service.

---

## Getting Started Locally

1. Clone the repository:

```bash
git clone https://github.com/your-username/SmartBrainFaceFinder.git
