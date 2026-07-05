# 🚖 Ride Booking System

## 📖 Introduction

The **Ride Booking System** is a backend REST API application developed using **Spring Boot** that simulates the core functionalities of ride-booking platforms like **Uber** and **Ola**. The application allows users to register, log in, book rides, while enabling drivers to accept, start, and complete rides. It also includes automatic fare calculation, payment processing, ride history, and driver earnings management.

The project is developed as a **fresher-level backend project** by following industry-standard practices such as **Layered Architecture, RESTful APIs, DTO Pattern, Validation, Exception Handling, and Business Logic Implementation**.

---

# 🛠️ Technologies Used

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA (Hibernate)
* MySQL
* Maven
* Lombok
* Bean Validation (Jakarta Validation)
* REST APIs
* Postman
* Git & GitHub

---

# 🏗️ Project Architecture

The application follows a **Monolithic Layered Architecture**.

```text
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

# 📂 Project Structure

```text
Ride-Booking-System
│
├── controller
├── service
│     └── impl
├── repository
├── entity
├── dto
│     ├── request
│     └── response
├── enums
├── exception
├── mapper
├── resources
└── RideBookingApplication
```

---

# ⚙️ Prerequisites

Install the following before running the project:

* Java 17
* Maven
* MySQL 8+
* Git
* IntelliJ IDEA / Eclipse
* Postman

---

# 📥 Clone the Repository

```bash
git clone https://github.com/<sanjupeddaboina>/ride-booking-system.git
```

```bash
cd ride-booking-system
```

---

# 🗄️ Database Configuration

Create a MySQL database.

```sql
CREATE DATABASE ride_booking_db;
```

Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ride_booking_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

# ▶️ Run the Application

Build the project

```bash
mvn clean install
```

Run the application

```bash
mvn spring-boot:run
```

Or run

```
RideBookingApplication.java
```

from your IDE.

---

# 🗃️ Database Entities

* User
* Driver
* Ride
* Payment
---

# 📌 Modules & Features

## 👤 User Module

* User Registration
* User Login
* Book Ride
* View Current Ride
* View Ride History
* Cancel Ride

---

## 🚗 Driver Module

* Driver Registration
* Driver Login
* Update Availability
* Accept Ride
* Start Ride
* Complete Ride
* View Current Ride
* View Total Earnings

---

## 🚕 Ride Module

* Ride Booking
* Automatic Driver Assignment
* Ride Status Tracking
* Distance-Based Fare Calculation
* Ride History

---

## 💳 Payment Module

* Make Payment

---

# 🔄 Ride Lifecycle

```text
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

or

```text
BOOKED
   │
   ▼
CANCELLED
```

---

# 🔗 Entity Relationships

```text
User (one)
   │
   │
   ▼
Ride (Many)
   │
   │ Many-to-One
   ▼
Driver (1)

Ride (1)
   │
   │ One-to-One
   ▼
Payment (1)
```

---

# ✨ Key Highlights

* Layered Architecture
* RESTful API Development
* DTO Pattern
* Spring Data JPA & Hibernate
* Bean Validation
* Global Exception Handling
* Automatic Driver Assignment
* Distance-Based Fare Calculation
* Driver Earnings Tracking
* Payment Management
* Tested 30+ APIs using Postman

---

# 👨‍💻 Author

**Sanjay Kumar Peddaboina**

---

# 📄 License

This project is developed for **learning purposes**.
