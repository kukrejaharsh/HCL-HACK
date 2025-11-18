# HCLTech Hackathon: Healthcare Wellness Portal (MVP)

This repository contains the 5-hour Minimum Viable Product (MVP) for the Healthcare Wellness and Preventive Care Portal. This LLD is based on the MERN stack and the provided data model.

## 🚀 MVP Scope (5-Hour Goal)

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

This stack was chosen for its speed, scalability, and suitability for a 5-hour MVP.

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



[Image of the database schema diagram provided by the user]


### 1. User Schema (`user.model.js`)
* **Description:** Stores the central identity and login information for *all* users. This is the "parent" collection.
* **Fields:**
    * `name`: String, required
    * `email`: String, required, unique
    * `password`: String, required (will be stored as a hash, from `pass` field)
    * `age`: Number
    * `phone`: String
    * `address`: {
        * `address`: String,
        * `city`: String,
        * `pincode`: String,
        * `state`: String
      }
    * `gender`: String
    * `role`: String, enum: `['patient', 'doctor']`
    * `consentGiven`: Boolean, required **(For registration checkbox)**

### 2. Patient Schema (`patient.model.js`)
* **Description:** Stores data *specific* to a user with the 'patient' role. It links to the User collection.
* **Fields:**
    * `user`: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } (The link to the User)
    * `bloodGroup`: String
    * `diagnosedWith`: String
    * `doctorAssigned`: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' } (Link to their assigned doctor)

### 3. Doctor Schema (`doctor.model.js`)
* **Description:** Stores data *specific* to a user with the 'doctor' role. It also links to the User collection.
* **Fields:**
    * `user`: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } (The link to the User)
    * `speciality`: String
    * `qualification`: String
    * `experienceInYears`: Number
    * `salary`: Number

### 4. Appointment Schema (`appointment.model.js`)
* **Description:** Represents a single appointment request and its status, linking a patient and a doctor.
* **Fields:**
    * `patient`: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
    * `doctor`: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
    * `status`: String, enum: `['pending', 'Accepted', 'Rejected']`, default: 'pending'
    * `appointmentDate`: Date
    * `requestedDate`: Date, default: Date.now
    * `reason`: String

### 5. Activity Log Schema (`activityLog.model.js`)
* **Description:** Stores daily health tracker data for a patient.
* **Fields:**
    * `patient`: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
    * `date`: Date, default: Date.now
    * `steps`: Number
    * `caloriesEaten`: Number
    * `caloriesTarget`: Number
    * `activityTimeInMinutes`: Number
    * `activityTimeTarget`: Number

### 6. Reminder Schema (`reminder.model.js`)
* **Description:** Stores preventive care reminders for patients (e.g., annual checkups).
* **Fields:**
    * `patient`: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
    * `name`: String (e.g., "Annual Blood Test", "Flu Shot")
    * `dueDate`: Date
    * `status`: String, enum: ['Pending', 'Completed', 'Missed'], default: 'Pending'

---

## 🔌 API Endpoints (Low-Level Design)

All endpoints are prefixed with `/api/`. All protected routes use JWT middleware.

### Module 1: Authentication (Public)
* **`POST /api/auth/register`**
    * **Description:** For the "Create User" page. This will create a `User` doc AND a `Patient` or `Doctor` doc.
    * **Body:** `{ "name", "email", "password", "role", "consentGiven": true, ...etc }`
    * **Response:** `201 Created`
* **`POST /api/auth/login`**
    * **Description:** For the "Login" page.
    * **Body:** `{ "email", "password" }`
    * **Response:** `200 OK` - `{ "token": "...", "user": { "id", "name", "role", "profileId" } }` (The `profileId` will be the ID from the `Patient` or `Doctor` collection).

### Module 2: Patient Module (Protected: `patient` role)
* **`GET /api/patient/profile`**
    * **Description:** Get the logged-in patient's full profile (merges `User` and `Patient` data).
* **`PUT /api/patient/profile`**
    * **Description:** Update the logged-in patient's profile.
* **`POST /api/activity-log`**
    * **Description:** Logs a new entry for the patient's health trackers.
    * **Body:** `{ "date", "steps", "caloriesEaten", ... }`
* **`GET /api/activity-log`**
    * **Description:** Gets all activity log entries for the logged-in patient.
* **`POST /api/appointments`**
    * **Description:** **(Book an Appointment)** A patient requests a new appointment.
    * **Body:** `{ "doctorId": "...", "appointmentDate": "...", "reason": "..." }`
* **`GET /api/appointments/my-appointments`**
    * **Description:** Gets a list of the patient's own upcoming and past appointments.
* **`GET /api/reminders`**
    * **Description:** Gets all active reminders for the logged-in patient's dashboard.
* **`PUT /api/reminders/:reminderId`**
    * **Description:** Allows a patient to mark a reminder as 'Completed'.
    * **Body:** `{ "status": "Completed" }`

### Module 3: Doctor (Provider) Module (Protected: `doctor` role)
* **`GET /api/doctor/patients`**
    * **Description:** Gets the main list of all patients assigned to the logged-in doctor.
* **`GET /api/doctor/patients/:patientId/profile`**
    * **Description:** Gets the *specific profile* (User + Patient data) for a single patient.
* **`GET /api/doctor/patients/:patientId/activity`**
    * **Description:** Gets the *activity log history* for a single patient.
* **`GET /api/doctor/patients/:patientId/reminders`**
    * **Description:** Gets the *preventive reminders* for a single patient.
* **`GET /api/doctor/appointments`**
    * **Description:** Gets all appointments (by status) for the logged-in doctor's schedule.
* **`PUT /api/doctor/appointments/:appointmentId`**
    * **Description:** **(Manage Appointment)** Allows the doctor to 'Accept' or 'Reject' a pending appointment.
    * **Body:** `{ "status": "Accepted" }`

### Module 4: Public Module
* **`GET /api/doctors`**
    * **Description:** Gets a public list of all doctors (name, specialty) so patients can choose one to book with.
* **`GET /api/public-info`**
    * **Description:** Gets the static content for the public health info page.