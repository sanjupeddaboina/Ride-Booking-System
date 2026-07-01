# 🚖 Ride Booking System

## Introduction

Ride Booking System is a backend REST API application developed using **Spring Boot** that simulates the core functionalities of modern ride-booking platforms like Uber and Ola. The system allows users to register, log in, book rides, view ride history, cancel rides, and enables drivers to manage ride requests. The project follows a **Monolithic Architecture** with layered design principles and RESTful APIs.

The project is designed as a **fresher-level backend project** while following industry-standard development practices such as layered architecture, DTO pattern, exception handling, validation, and business rules.

---

# Technologies and Dependencies

- **Java 17** - Programming Language
- **Spring Boot** - Backend Framework
- **Spring Web** - REST API Development
- **Spring Data JPA (Hibernate)** - ORM Framework
- **MySQL** - Relational Database
- **Maven** - Dependency Management
- **Lombok** - Reduces Boilerplate Code
- **Bean Validation** - Request Validation
- **REST APIs** - Communication between Client and Server
- **Git & GitHub** - Version Control
- **Postman** - API Testing

---

# Project Architecture

The application follows **Monolithic Architecture** with a layered structure.

```
Controller Layer
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
MySQL Database
```

---

# Project Structure

```
Ride-Booking-System
│
├── controller
├── service
│      ├── impl
├── repository
├── entity
├── dto
│      ├── request
│      ├── response
├── enums
├── exception
├── config
├── util
└── resources
```

---

# Using Ride Booking System

## Prerequisites

Before running the project, install:

- Java 17
- Maven 3.9+
- MySQL 8+
- Git
- IntelliJ IDEA / Eclipse / VS Code
- Postman

---

# Clone the Project

Open Terminal / Git Bash

```bash
git clone https://github.com/<your-github-username>/ride-booking-system.git
```

Go inside the project

```bash
cd ride-booking-system
```

---

# Configure Database

Create a MySQL database.

```sql
CREATE DATABASE ride_booking_db;
```

Open

```
src/main/resources/application.properties
```

Update your database credentials.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ride_booking_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

# Build the Project

Using Maven

```bash
mvn clean install
```

---

# Run the Application

Using Maven

```bash
mvn spring-boot:run
```

OR

Open the project in IntelliJ IDEA or Eclipse and run

```
RideBookingApplication.java
```

---

# Verify the Application

Once started successfully

```
http://localhost:8080
```

---

# API Testing

Use Postman to test all functionalities

Recommended testing sequence

1. Register User
2. Login User
3. Register Driver
4. Login Driver
5. Book Ride
6. View Current Ride
7. Cancel Ride
8. Driver Accept Ride
9. Start Ride
10. Complete Ride
11. Generate Payment
12. Complete Payment

---

# Backend Design

## Entities

The system contains the following entities.

---

## User

Represents customers who can book rides.

Attributes

- userId
- fullName
- email
- phoneNumber
- password
- createdAt

---

## Driver

Represents drivers who accept ride requests.

Attributes

- driverId
- fullName
- email
- phoneNumber
- password
- vehicleNumber
- vehicleType
- availability
- totalEarnings

Availability

---

## Ride

Represents a ride booked by a user.

Attributes

- rideId
- pickupLocation
- destination
- vehicleType
- fare
- bookingTime
- startTime
- completionTime
- rideStatus
- user
- driver

Ride Status

- REQUESTED
- ACCEPTED
- STARTED
- COMPLETED
- CANCELLED

---

## Payment

Represents payment for a completed ride.

Attributes

- paymentId
- amount
- paymentMethod
- paymentStatus
- paymentTime
- ride

Payment Method

- CASH
- UPI

Payment Status

- PENDING
- SUCCESS
- FAILED

---

# Entity Relationships

```
User
 │
 │ One User
 │
 ▼
Many Rides
 │
 │ Many Rides
 ▼
One Driver

Ride
 │
 │ One-to-One
 ▼
Payment
```

---

# Functionalities Implemented

## User Module

- User Registration
- User Login
- Book Ride
- View Current Ride
- View Ride History
- Cancel Ride

---

## Driver Module *(In Progress)*

- Driver Registration
- Driver Login
- Driver Availability
- Accept Ride
- Reject Ride
- Start Ride
- Complete Ride
- View Completed Rides
- View Earnings

---

## Ride Module *(In Progress)*

- Automatic Driver Assignment
- Ride Lifecycle Management
- Ride Status Tracking
- Fare Calculation

---

## Payment Module *(In Progress)*

- Generate Payment
- Payment Processing
- Payment Status Tracking

---

# Future Enhancements

- JWT Authentication
- Role-Based Authorization
- OTP Verification
- Google Maps API Integration
- Distance Calculation
- Dynamic Fare Calculation
- Ride Scheduling
- Driver Ratings
- User Ratings
- Ride Notifications
- Payment Integration Simulation
- Live Ride Tracking
- Admin Dashboard
- Docker Deployment
---

# Author

**Sanjay Kumar Peddaboina**

# License

This project is developed for learning purposes and personal portfolio.
