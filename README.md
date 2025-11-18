# HCLTech Hackathon: Healthcare Wellness Portal (MVP)

This repository contains the Minimum Viable Product (MVP) for the Healthcare Wellness and Preventive Care Portal given as part of HCL hackathon. This LLD is based on the MERN stack and the provided data model.

## 🚀 MVP Scope 

The primary goal is to deliver a functional, deployed, and secure demonstration.
* **Core Features:** Functional authentication, patient dashboard (trackers, appointments, **and reminders**), a provider dashboard (patient list, compliance), and profile management.
* **DevOps:** A functional CI/CD pipeline.
* **Security & Compliance:** Prioritize security over complex features, demonstrating an understanding of healthcare data requirements (basic HIPAA considerations including **user consent**).

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (using the `Mongoose` ODM)
* **Authentication:** JSON Web Tokens (JWT)
* **Deployment:** Vercel (Frontend), Render (Backend)
* **CI/CD:** GitHub Actions

---

## 💡 Tech Stack Rationale (Why This Stack?)

This stack was chosen for its speed, scalability, and suitability.

* **React.js (Frontend):**
    * **Component-Based:** We can build reusable UI elements (like a `TrackerCard` or `AppointmentItem`), which speeds up development significantly.
    * **High Performance:** Creates a fast, responsive Single Page Application (SPA) that feels fluid for the user, improving the patient experience.

* **Node.js (Backend Runtime):**
    * **Full-Stack JavaScript:** Using JavaScript on both the frontend and backend reduces context-switching and allows us to share logic, which is ideal for a fast-paced hackathon.
    * **Efficient I/O:** Its non-blocking, event-driven architecture is excellent for handling many simultaneous API requests and database operations efficiently.

* **Express.js (Backend Framework):**
    * **Fast & Minimalist:** It provides a simple, un-opinionated layer for building REST APIs. This allows us to define our routes (`/api/...`) and middleware (for auth) very quickly.
    * **Maturity:** A massive ecosystem of middleware (like `jsonwebtoken`, `bcryptjs`, `cors`) solves common problems for us, saving valuable time.

* **MongoDB (Database):**
    * **JSON-Native:** MongoDB stores data in BSON (a binary JSON format). This means our JavaScript objects from the Node.js backend map perfectly to the database, eliminating the need for complex SQL joins.
    * **Flexible Schema:** For an MVP, this is critical. We can easily add new fields to our schemas (like a new tracker type) without complex database migrations, allowing for rapid iteration.

---

## 🏗️ Solution Architecture

This project follows a **3-Tier (Separated Frontend/Backend)** architecture:

1.  **Frontend (Client):** A React.js single-page application (SPA).
2.  **Backend (Server):** An Express.js API server that handles all business logic, database interactions, and authentication.
3.  **Database (Data Layer):** A cloud-hosted MongoDB Atlas cluster.



---

## 🗃️ Database Schema (Mongoose LLD)

This is the design for our Mongoose schemas, based on the provided data model. This architecture separates user identity from role-specific data, which is a very scalable approach.


erDiagram
    %% --- RELATIONSHIPS ---
    USERS ||--|| DOCTOR : "has profile"
    USERS ||--|| PATIENTS : "has profile"
    DOCTOR ||--o{ PATIENTS : "assigned primary care"
    
    PATIENTS ||--o{ APPOINTMENTS : "requests"
    DOCTOR ||--o{ APPOINTMENTS : "reviews/manages"
    
    PATIENTS ||--o{ ACTIVITY_LOG : "tracks daily stats"

    %% --- ENTITY DEFINITIONS ---
    
    USERS {
        ObjectId _id PK
        String name
        String email
        String pass "hashed"
        Number age
        String phone
        Object address "Street, City, State, Pincode"
        String gender
        Enum role "admin | doctor | patient"
    }

    DOCTOR {
        ObjectId _id PK
        ObjectId user_id FK "Ref: USERS"
        String speciality
        String qualification
        Number experience "Years"
        Number salary
    }

    PATIENTS {
        ObjectId _id PK
        ObjectId user_id FK "Ref: USERS"
        String BloodGroup
        String DiagnosedWith
        ObjectId DoctorAssigned FK "Ref: DOCTOR"
    }

    APPOINTMENTS {
        ObjectId _id PK
        ObjectId patient_id FK "Ref: PATIENTS"
        ObjectId doctor_id FK "Ref: DOCTOR"
        Enum status "pending | Accepted | Rejected"
        Date appointmentDate
        Date requestedDate
        String Reason
    }

    ACTIVITY_LOG {
        ObjectId _id PK
        ObjectId patient_id FK "Ref: PATIENTS"
        Date DATE
        Number STEPS
        Number CALORIES_EATEN
        Number CALORIES_TARGET
        Number activityTimeMinutes
        Number activityTimeTarget
    }

## System Architecture & Design

High-Level Design (HLD)

The system follows a layered REST API architecture to ensure separation of concerns, scalability, and security.

graph TD
    Client[Client Web/Mobile] -->|HTTPS| Gateway[API Gateway / Nginx]
    Gateway --> Server[Node.js + Express Server]
    
    subgraph Server Layer
    Security[🛡️ Security Layer Helmet/CORS] --> Auth[🔑 Auth Layer JWT/RBAC]
    Auth --> Controllers[🎮 Controllers]
    Controllers --> Services[🧠 Service Layer]
    Services --> Models[🗄️ Data Access Layer]
    end
    
    Models --> DB[(MongoDB Database)]

## Data Flow & Components

**Component Description**

**1. Authentication**

Source: Centralized User collection.



Mechanism: JWT tokens containing role ('patient', 'doctor') and profileId.

**2. Patient Dashboard**

Input: Logs daily metrics (steps, calories).



Processing: Aggregates ActivityLog & fetches Appointments.



Output: JSON optimized for frontend charts.

**3. Appointment System**

Request: Patient initiates booking.



Queue: Stored as 'pending'.



Resolution: Doctor accepts/rejects -> Status updates to 'Accepted'/'Rejected'.

**4. Doctor Dashboard**

View: Aggregates pending Appointments & assigned Patients.

## ⚙️ Low-Level Design (LLD): API Specifications

**1. 🔐 Authentication Module**

Login User

Endpoint: POST /api/auth/login

Description: Validates credentials and returns an access token.

Request Body

{
  "email": "john@example.com",
  "pass": "secret123"
}


Response (Success)

{
  "success": true,
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "_id": "user_001",
    "name": "John Doe",
    "role": "patient",
    "patientProfile": "pat_001" 
    // OR "doctorProfile": "doc_001"
  }
}


**2. 🏃 Patient Dashboard & Activity API**

Log Daily Activity

Endpoint: POST /api/patient/activity

Headers: Authorization: Bearer <token>

Request Body

{
  "DATE": "2023-10-27",
  "STEPS": 8500,
  "CALORIES_EATEN": 2100,
  "CALORIES_TARGET": 2000,
  "activityTimeMinutes": 45,
  "activityTimeTarget": 60
}


Response

{
  "success": true,
  "message": "Activity logged successfully",
  "data": { "_id": "log_555", "STEPS": 8500 }
}


Get Dashboard Stats

Endpoint: GET /api/patient/dashboard

Query Params: ?range=7days (optional)

Response

{
  "success": true,
  "data": {
    "summary": {
      "todaySteps": 8500,
      "todayCalories": 2100
    },
    "history": [
      { "DATE": "2023-10-26", "STEPS": 9000 },
      { "DATE": "2023-10-27", "STEPS": 8500 }
    ]
  }
}


**3. 📅 Appointment & Requests API**

Request Appointment

Endpoint: POST /api/appointments/request

Access: Patient only

Request Body

{
  "doctor_id": "doc_001", 
  "requestedDate": "2023-11-01T10:00:00Z",
  "Reason": "Persistent headache and dizziness"
}


Response

{
  "success": true,
  "data": {
    "_id": "appt_101",
    "status": "pending",
    "Reason": "Persistent headache and dizziness"
  }
}


Get Appointment History

Endpoint: GET /api/appointments/my-history

Response

{
  "success": true,
  "data": [
    {
      "_id": "appt_100",
      "status": "Accepted",
      "appointmentDate": "2023-10-20T09:00:00Z",
      "doctor_details": { 
          "name": "Dr. Smith", 
          "speciality": "Cardiology" 
      }
    }
  ]
}


**4. 👨‍⚕️ Doctor Dashboard API**

Get Pending Requests

Endpoint: GET /api/doctor/requests

Logic: Fetches appointments where doctor_id matches current user AND status is 'pending'.

Response

{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "appt_101",
      "requestedDate": "2023-11-01T10:00:00Z",
      "Reason": "Persistent headache",
      "patient_details": {
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "DiagnosedWith": "Migraine"
      }
    }
  ]
}


Respond to Request

Endpoint: PATCH /api/appointments/:id/status

Request Body

{
  "status": "Accepted", // Enum: 'Accepted' | 'Rejected'
  "appointmentDate": "2023-11-01T10:30:00Z" // Required if Accepted
}


Response

{
  "success": true,
  "data": { 
      "status": "Accepted", 
      "appointmentDate": "2023-11-01T10:30:00Z" 
  }
}


Get My Patients

Endpoint: GET /api/doctor/patients

Logic: Fetches patients where DoctorAssigned matches current doctor ID.

Response

{
  "success": true,
  "data": [
    {
      "_id": "pat_001",
      "BloodGroup": "O+",
      "DiagnosedWith": "Hypertension",
      "user_details": {
        "name": "Alice Bob",
        "email": "alice@example.com",
        "phone": "123-456-7890"
      }
    }
  ]
}


**5. 👤 User Profile API**

Get My Profile

Endpoint: GET /api/users/profile

Description: Returns role-specific profile data.

Response (Patient View)

{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@mail.com",
    "address": { "address1": "123 St", "city": "NY" },
    "patient_info": {
      "BloodGroup": "A+",
      "DiagnosedWith": "None",
      "DoctorAssigned": "Dr. Smith"
    }
  }
}


Response (Doctor View)

{
  "success": true,
  "data": {
    "name": "Dr. Smith",
    "doctor_info": {
      "speciality": "Cardiology",
      "experience": 10,
      "qualification": "MBBS"
    }
  }
