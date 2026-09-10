# 🚖 Ride Booking System

A full-stack Ride Booking Application with a **Spring Boot REST API backend** and a **vanilla HTML/CSS/JS frontend**. It covers the full ride lifecycle — registration, login, ride booking, automatic driver assignment, ride progress, payment, and earnings — secured with JWT authentication and role-based access control.

---

## 📖 Overview

The system has two independent parts in this repository:

| Part | Location | Stack |
|---|---|---|
| **Backend API** | `src/` | Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA (Hibernate), MySQL |
| **Frontend** | `ride-booking-frontend/` | Static HTML, CSS, vanilla JavaScript (no build step) |

Users can register, log in, book a ride, and view ride history. Drivers can register, log in, go online/offline, and manage the lifecycle of a ride (accept → start → complete). Fares are calculated automatically based on vehicle type and distance, and a simulated payment can be recorded once a ride is completed.

---

## ✨ Features

### 👤 User
- Register / log in (JWT issued on login)
- View own profile
- Book a ride (pickup, drop, distance, vehicle type)
- View current active ride
- View ride history
- Cancel a ride (only while it's still `BOOKED`)

### 🚗 Driver
- Register / log in (JWT issued on login)
- Toggle status: `ONLINE` / `OFFLINE`
- View pending (assigned but not yet accepted) ride
- View current active ride
- Accept → Start → Complete a ride
- View ride history
- View total earnings

### 🚕 Ride Engine
- Automatic driver assignment: a random available online driver matching the requested vehicle type is assigned at booking time (not at acceptance time), so no driver can be double-booked
- Distance-based fare calculation per vehicle type
- Full status lifecycle with server-side transition validation
- Business rules preventing a rider or driver from holding more than one active ride

### 💳 Payment
- Record a payment against a completed ride (`CASH` or `UPI`)
- Look up a payment by ride ID

### 🔐 Security
- BCrypt password hashing
- JWT-based stateless authentication
- Role-based access control (`ROLE_USER` / `ROLE_DRIVER`) enforced both at the security-filter-chain level and with `@PreAuthorize` on controller methods
- CORS configured for local frontend origins

---

## 📌 Ride Lifecycle

```
User books ride
      │
      ▼
Driver auto-assigned  →  status: BOOKED
      │
      ▼
Driver accepts         →  status: ACCEPTED
      │
      ▼
Driver starts trip      →  status: STARTED
      │
      ▼
Driver completes trip   →  status: COMPLETED
      │
      ▼
Payment recorded        →  status: SUCCESS

(A BOOKED ride can instead be CANCELLED by the user before it's accepted.)
```

---

## 🏗️ Architecture

The backend follows a standard layered architecture:

```
Controller  →  Service  →  Repository  →  Database (MySQL)
```

- **Controller** — REST endpoints, request validation
- **Service** — business logic and rule enforcement
- **Repository** — Spring Data JPA persistence
- **Entity** — JPA-mapped domain objects
- **DTO** — request/response payloads, kept separate from entities
- **Security** — JWT filter + `SecurityConfig` wiring roles to routes
- **Exception** — centralized `@RestControllerAdvice` error handling

---

## 📂 Project Structure

```
ride-booking-system/
├── src/
│   ├── main/java/com/ridebooking/
│   │   ├── config/            # CorsConfig, SecurityConfig
│   │   ├── controller/        # UserController, DriverController, RideController, PaymentController
│   │   ├── dto/
│   │   │   ├── request/       # driver/, ride/, user/, payement/
│   │   │   └── response/      # auth/, driver/, ride/, user/, payement/
│   │   ├── entity/            # User, Driver, Ride, Payment
│   │   ├── enums/             # RideStatus, DriverStatus, VehicleType, PaymentMethod, PaymentStatus
│   │   ├── exception/         # Custom exceptions + GlobalExceptionHandler
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── security/          # JwtService, JwtAuthenticationFilter
│   │   ├── service/           # Service interfaces
│   │   │   └── impl/          # Service implementations
│   │   └── RideBookingSystemApplication.java
│   ├── main/resources/
│   │   └── application.properties
│   └── test/java/com/ridebooking/
│       └── RideBookingSystemApplicationTests.java
│
├── ride-booking-frontend/
│   ├── index.html              # Landing page
│   ├── css/                    # global, auth, dashboard, user, driver styles
│   ├── js/
│   │   ├── api/                # api-client.js + user/driver/ride/payment API wrappers
│   │   ├── auth/                # user & driver login/register/logout
│   │   ├── user/                # booking flow, dashboard, ride history, profile, payment
│   │   ├── driver/               # dashboard, available rides, earnings, ride history
│   │   ├── utils/                # auth-guard, storage, ride-state, route-map, ui helpers
│   │   └── config.js             # API_BASE_URL
│   └── pages/
│       ├── auth/{user,driver}/   # login & register pages
│       ├── user/user-dashboard.html
│       └── driver/driver-dashboard.html
│
├── pom.xml
├── mvnw / mvnw.cmd
└── README.md
```

---

## ⚙️ Tech Stack

**Backend**
- Java 17
- Spring Boot 3.5.15 (Web, Data JPA, Validation, Security)
- Hibernate / Spring Data JPA
- MySQL (`mysql-connector-j`)
- JWT via `jjwt` 0.12.6
- Lombok
- Maven

**Frontend**
- HTML5, CSS3
- Vanilla JavaScript (`fetch` API, no framework/build tool)

---

## 🗄️ Data Model

**Entities:** `User`, `Driver`, `Ride`, `Payment`

```
User  1 ──── * Ride * ──── 1 Driver
                │
                │ 1
                ▼
              Payment  (1:1 with Ride)
```

- A `User` can have many `Ride`s; a `Ride` belongs to exactly one `User`.
- A `Driver` can have many `Ride`s over time, but only one **active** ride at once (enforced in the service layer, not by the schema).
- A `Ride` has at most one `Payment`.

`spring.jpa.hibernate.ddl-auto=update` is set, so tables are created/updated automatically from the entities on startup — no manual schema or migration scripts are needed for local development.

---

## 📋 Key Business Rules

**User**
- A user cannot have more than one ride in `BOOKED` / `ACCEPTED` / `STARTED` state at a time.
- A ride can only be cancelled by the user who booked it, and only while it's still `BOOKED`.

**Driver**
- A driver is marked unavailable the instant they're auto-assigned to a ride (not when they accept), preventing double-assignment.
- A driver becomes available again once the ride is completed or cancelled.
- Only the driver assigned to a ride can accept, start, or complete it.

**Ride status transitions**
- `BOOKED → ACCEPTED → STARTED → COMPLETED` (linear, enforced server-side)
- `BOOKED → CANCELLED` is the only alternate path

**Payment**
- A `PaymentRequest` can be submitted for any ride ID; the service layer is responsible for validating ride state and preventing duplicates.

---

## 🚀 Getting Started

### Prerequisites
- JDK 17+
- Maven (or use the included `mvnw` / `mvnw.cmd` wrapper)
- MySQL 8+ running locally (or reachable via the env vars below)
- A modern browser for the frontend (no build tooling required)

### 1. Clone the repository
```bash
git clone https://github.com/sanjupeddaboina/ride-booking-system
cd ride-booking-system
```

### 2. Configure the database
The app reads its DB connection from environment variables, falling back to local defaults if unset (`src/main/resources/application.properties`):

| Variable | Default | Purpose |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/ridebooking_db` | JDBC connection string |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | `root` | MySQL password |
| `SERVER_PORT` | `8080` | Port the API listens on |

Either export these before running, or just make sure a local MySQL instance matches the defaults and has a database named `ridebooking_db` (it will be created/updated automatically by Hibernate on first run — you don't need to create tables manually, though you may need to create the empty database itself depending on your MySQL setup).

```bash
export DB_URL=jdbc:mysql://localhost:3306/ridebooking_db
export DB_USERNAME=root
export DB_PASSWORD=your_password
```

### 3. Run the backend
```bash
# Linux / macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```
The API starts on `http://localhost:8080` by default.

### 4. Run the frontend
The frontend is fully static — no build step. Just serve the `ride-booking-frontend/` folder and open it in a browser, e.g.:
```bash
cd ride-booking-frontend
python3 -m http.server 5500
# then visit http://localhost:5500
```
It talks to the API via `API_BASE_URL` in `ride-booking-frontend/js/config.js`, which is set to `http://localhost:8080/api/v1` — update this if your backend runs elsewhere.

> The backend's CORS policy (`SecurityConfig` / `CorsConfig`) allows any `http://localhost:*` or `http://127.0.0.1:*` origin, so serving the frontend on any local port should work out of the box.

---

## 📡 API Reference

Base URL: `http://localhost:8080/api/v1`

All authenticated endpoints require a header: `Authorization: Bearer <token>`, where the token is obtained from a login response.

### Auth & Users (`/users`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | Public | Register a new rider |
| POST | `/users/login` | Public | Log in, returns JWT |
| GET | `/users/{userId}` | USER | Get user profile |
| GET | `/users/{userId}/current` | USER | Get current active ride |
| GET | `/users/{userId}/rides` | USER | Get ride history |

### Drivers (`/drivers`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/drivers/register` | Public | Register a new driver |
| POST | `/drivers/login` | Public | Log in, returns JWT |
| GET | `/drivers/{driverId}` | DRIVER | Get driver profile |
| PUT | `/drivers/{driverId}/status` | DRIVER | Set status to `ONLINE`/`OFFLINE` |
| GET | `/drivers/{driverId}/current` | DRIVER | Get current active ride |
| GET | `/drivers/{driverId}/pending` | DRIVER | Get newly-assigned, not-yet-accepted ride |
| GET | `/drivers/{driverId}/rides` | DRIVER | Get ride history |
| GET | `/drivers/{driverId}/earnings` | DRIVER | Get total earnings |

### Rides (mounted under `/users` — see note below)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/{userId}/rides/book` | USER | Book a ride (auto-assigns a driver) |
| PUT | `/users/{rideId}/rides/accept` | DRIVER | Driver accepts an assigned ride |
| PUT | `/users/{rideId}/rides/start` | DRIVER | Driver starts the trip |
| PUT | `/users/{rideId}/rides/complete` | DRIVER | Driver completes the trip |
| PUT | `/users/{rideId}/rides/cancel` | USER | User cancels a `BOOKED` ride |

### Payments (`/payments`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/payments` | Authenticated | Record a payment for a completed ride |
| GET | `/payments/rides/{rideId}` | USER | Get payment details for a ride |


### Fare calculation
Fare = base fare + (per-km rate × distance), by vehicle type:

| Vehicle | Base Fare | Per KM |
|---|---|---|
| BIKE | ₹50 | ₹8 |
| AUTO | ₹70 | ₹12 |
| MINI | ₹100 | ₹16 |
| SEDAN | ₹150 | ₹20 |

## 🧪 Testing

API behavior has been manually verified with Postman, covering CRUD operations, complete ride workflows, input validation, exception handling, and edge cases.

---

## 🚧 Future Enhancements

- GPS-based driver tracking and nearest-driver matching
- Google Maps integration for routing and ETA
- WebSocket-based real-time ride tracking
- Push notifications
- Redis caching
- Docker deployment and CI/CD pipeline
- Automated unit and integration test coverage

---

## 👨‍💻 Author

**Sanjay Kumar Peddaboina**

This project was built as a learning exercise in enterprise-style backend development (layered architecture, JWT auth/RBAC, DTOs, global exception handling) paired with a plain-JS frontend consuming the API end to end.
