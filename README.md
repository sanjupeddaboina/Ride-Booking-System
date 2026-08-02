# 🚖 Ride Booking System

## 📖 Introduction

The Ride Booking System is a backend REST API application developed using Spring Boot that simulates the core functionalities of ride-hailing platforms like Uber, Ola, and Rapido. The application enables users to register, authenticate, book rides, and view ride history, while allowing drivers to manage ride requests, update availability, accept rides, start trips, complete rides, and track their earnings. It also includes automatic driver assignment, distance-based fare calculation, payment processing, and ride lifecycle management.

The project is built using Layered Architecture and follows industry-standard backend development practices, including RESTful API design, DTO Pattern, Spring Data JPA, Hibernate, Bean Validation, Global Exception Handling, and Business Rule Validation, making it a strong backend project for learning enterprise application development.

## Key Contributions :

1. Designed and implemented the complete ride lifecycle, including ride booking, automatic driver assignment, ride acceptance, trip start/completion, ride cancellation, payment processing, ride history, and driver earnings management.
2. Designed a normalized relational database schema and implemented One-to-One, One-to-Many, and Many-to-One relationships using Spring Data JPA and Hibernate for User, Driver, Ride, and Payment entities.
3. Implemented robust business validations to enforce real-world constraints, such as preventing multiple active rides, validating ride status transitions, restricting ride cancellation after driver acceptance, and allowing payments only after ride completion.
5. Developed 30+ RESTful APIs for user, driver, ride, and payment management using appropriate HTTP methods, status codes, and consistent JSON responses.
6. Applied the DTO Pattern, Bean Validation, and Global Exception Handling (@ControllerAdvice) to improve API validation, maintainability, and error handling.
7. Implemented distance-based fare calculation, driver earnings calculation, and a simulated payment workflow to replicate real-world ride booking operations.
8. Tested all APIs using Postman, covering CRUD operations, complete ride workflows, input validation, exception handling, and edge-case scenarios.
9. Used Git for version control and followed modular, maintainable coding practices to support scalability and future enhancements.

---

# ✨ Features

## 👤 User Module

- User Registration
- User Login
- Get User Details
- Book a Ride
- View Current Ride
- View Ride History (Completed Rides)

---

## 🚗 Driver Module

- Driver Registration
- Driver Login
- Update Driver Status (Online / Offline)
- View Pending Ride Request
- View Current Ride
- View Ride History
- View Total Earnings

---

## 🚕 Ride Module

- Book Ride
- Automatic Driver Assignment
- Random Driver Selection (Current Implementation)
- Accept Ride
- Start Ride
- Complete Ride
- Cancel Ride
- Ride Status Management

---

## 💳 Payment Module

- Make Payment
- Retrieve Payment by Ride ID
- Payment Validation
- Prevent Duplicate Payments

---

# 📌 Ride Lifecycle

```
User Books Ride
        │
        ▼
Driver Assigned
        │
        ▼
Ride BOOKED
        │
        ▼
Driver ACCEPTS Ride
        │
        ▼
Ride STARTED
        │
        ▼
Ride COMPLETED
        │
        ▼
Payment SUCCESS
```

---

# 🏗️ Project Architecture

The project follows **Layered Architecture**.

```
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Database (MySQL)
```

Each layer has a single responsibility.

- Controller → REST APIs
- Service → Business Logic
- Repository → Database Operations
- Entity → Database Mapping
- DTO → Request & Response Objects

---

# 📂 Project Structure

```
src
└── main
    ├── java
    │   └── com.ridebooking
    │       ├── config
    │       ├── controller
    │       ├── dto
    │       │   ├── request
    │       │   └── response
    │       ├── entity
    │       ├── enums
    │       ├── exception
    │       ├── repository
    │       ├── service
    │       └── RideBookingSystemApplication.java
    │
    └── resources
        └── application.properties
```

---

# ⚙️ Tech Stack

## Backend

- Java 17
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- Maven

## Database

- MySQL

## API Testing

- Postman

## Build Tool

- Maven

---

# 📋 Business Rules

## User

- A user cannot have more than one active ride.
- A ride cannot be booked without a registered user.
- A ride can only be cancelled before the driver accepts it.

---

## Driver

- A driver cannot accept multiple active rides.
- Driver can go Offline only if there is no active ride.
- Driver earnings are updated after ride completion.

---

## Ride

Ride Status Flow:

```
BOOKED
   │
   ▼
ACCEPTED
   │
   ▼
STARTED
   │
   ▼
COMPLETED
```

Rules:

- Only BOOKED rides can be accepted.
- Only ACCEPTED rides can be started.
- Only STARTED rides can be completed.

---

## Payment

- Payment is allowed only after ride completion.
- Duplicate payments are not allowed.
- Payment amount must match ride fare.

---

# 🗄️ Database

Main Entities

- User
- Driver
- Ride
- Payment

Relationships

```
User
 │
 └──────< Ride >────── Driver
            │
            │
         Payment
```

---

# ✅ Implemented Features

✔ Layered Architecture

✔ RESTful API Design

✔ DTO Pattern

✔ Constructor Dependency Injection

✔ Global Exception Handling

✔ Custom Exceptions

✔ Input Validation

✔ Business Rule Validation

✔ Automatic Driver Assignment

✔ Ride Lifecycle Management

✔ Distance Based Fare Calculation

✔ Payment Processing

✔ Driver Earnings Calculation

✔ Clean Project Structure

---

# 🚧 Future Enhancements

The following features are planned for future implementation:

- Spring Security
- JWT Authentication
- Role-Based Authorization
- BCrypt Password Encryption
- GPS-Based Driver Tracking
- Nearest Driver Matching Algorithm
- Google Maps Integration
- Live Driver Location Updates
- WebSocket-Based Real-Time Ride Tracking
- Push Notifications
- Ride ETA Calculation
- Redis Caching
- Docker Deployment
- Unit Testing
- Integration Testing
- CI/CD Pipeline
- AWS Deployment

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/sanjupeddaboina/Ride-Booking-System.git
```

---

## Navigate to Project

```bash
cd Ride-Booking-System
```

---

## Configure Database

Update:

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ride_booking
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## Run Project

Using Maven Wrapper

Windows

```bash
mvnw.cmd spring-boot:run
```

Linux / Mac

```bash
./mvnw spring-boot:run
```

---

# 👨‍💻 Author

**Sanjay Kumar Peddaboina**

---

## ⭐ If you found this project useful, consider giving it a Star!
This project is developed for **learning purposes**.
