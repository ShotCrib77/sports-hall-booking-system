CREATE TABLE IF NOT EXISTS users (
	user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    password_hash CHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_banned BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS courts (
	court_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    court_name VARCHAR(32) NOT NULL UNIQUE,
    sport VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
	booking_id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	court_id INT NOT NULL,
    booked_date  DATE NOT NULL,
    booked_time TIME NOT NULL,
    booking_status ENUM("confirmed", "cancelled", "no_show", "completed") DEFAULT "confirmed",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (court_id) REFERENCES courts(court_id),
    
	active_slot VARCHAR(60) AS (
        IF(booking_status = 'confirmed', CONCAT(court_id, '-', booked_date, '-', booked_time), NULL)
    ) STORED,
	UNIQUE KEY uq_active_slot (active_slot)
);

INSERT INTO courts (court_name, sport) VALUES ("Tennis A", "tennis");
INSERT INTO courts (court_name, sport) VALUES ("Tennis B", "tennis");
INSERT INTO courts (court_name, sport) VALUES ("Badminton A", "badminton");
INSERT INTO courts (court_name, sport) VALUES ("Badminton B", "badminton");
INSERT INTO courts (court_name, sport) VALUES ("Badminton C", "badminton");
INSERT INTO courts (court_name, sport) VALUES ("Badminton D", "badminton");
INSERT INTO courts (court_name, sport) VALUES ("Badminton E", "badminton");
INSERT INTO courts (court_name, sport) VALUES ("Badminton F", "badminton");
INSERT INTO courts (court_name, sport) VALUES ("Padel A", "padel");