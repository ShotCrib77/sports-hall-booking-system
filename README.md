Need these enviroment variables:
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=users_schema

MYSQL
CREATE SCHEMA sports_hall;

USE sports_hall;

CREATE TABLE users (
	user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    password_hash CHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_banned BOOLEAN DEFAULT FALSE
);

CREATE TABLE courts (
	court_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    court_name VARCHAR(32) NOT NULL,
    sport VARCHAR(32)
);

CREATE TABLE bookings (
	user_id INT NOT NULL,
	court_id INT NOT NULL,
    booked_date  DATE NOT NULL,
    booked_time TIME NOT NULL,
    booking_status ENUM("confirmed", "cancelled", "no_show", "completed") DEFAULT "confirmed",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (court_id, booked_date, booked_time),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (court_id) REFERENCES courts(court_id)
);