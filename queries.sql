-- =========================================
-- DROP TABLES (FOR RESET)
-- =========================================
DROP TABLE IF EXISTS admin_remark;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS complaint;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS complaint_status;
DROP TABLE IF EXISTS users;

-- =========================================
-- CREATE TABLES
-- =========================================

-- users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    department VARCHAR(50),
    year INT
);

-- category table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100)
);

-- complaint status table
CREATE TABLE complaint_status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50)
);

-- complaint table
CREATE TABLE complaint (
    complaint_id SERIAL PRIMARY KEY,
    title VARCHAR(150),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    user_id INT,
    category_id INT,
    status_id INT DEFAULT 1,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (status_id) REFERENCES complaint_status(status_id)
);

-- admin remark table
CREATE TABLE admin_remark (
    remark_id SERIAL PRIMARY KEY,
    remark_text TEXT,
    remark_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    complaint_id INT UNIQUE,
    FOREIGN KEY (complaint_id) REFERENCES complaint(complaint_id)
);

-- login history table
CREATE TABLE login_history (
    login_id SERIAL PRIMARY KEY,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================================
-- INSERT DATA
-- =========================================

-- users
INSERT INTO users (name, email, password, department, year) VALUES
('rahul sharma', 'rahul@gmail.com', 'pass123', 'cse', 2),
('ankit verma', 'ankit@gmail.com', 'pass123', 'it', 3),
('priya singh', 'priya@gmail.com', 'pass123', 'cse', 1),
('neha gupta', 'neha@gmail.com', 'pass123', 'ece', 4),
('aman jain', 'aman@gmail.com', 'pass123', 'pass123', 'me', 2);

-- category
INSERT INTO category (category_name) VALUES
('hostel'),
('classroom'),
('library'),
('cafeteria'),
('internet'),
('other');

-- complaint status
INSERT INTO complaint_status (status_name) VALUES
('submitted'),
('under review'),
('in progress'),
('resolved'),
('rejected');

-- complaints
INSERT INTO complaint (title, description, user_id, category_id) VALUES
('fan not working', 'fan is broken in classroom', 1, 2),
('wifi issue', 'internet is very slow', 2, 5),
('mess food', 'food quality is poor', 3, 4),
('water leakage', 'washroom leaking', 4, 1),
('bus delay', 'college bus is late', 5, 3);

-- admin remarks
INSERT INTO admin_remark (remark_text, complaint_id) VALUES
('forwarded to maintenance', 1),
('checking network issue', 2),
('inspection scheduled', 3),
('issue resolved', 4),
('bus timing updated', 5);

-- login history
INSERT INTO login_history (user_id) VALUES
(1),
(2),
(3),
(4),
(5);

-- =========================================
-- SAMPLE JOIN QUERY (FOR TESTING)
-- =========================================

SELECT 
    c.complaint_id,
    u.name,
    c.title,
    cs.status_name,
    ar.remark_text,
    ar.remark_date
FROM complaint c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN complaint_status cs ON c.status_id = cs.status_id
LEFT JOIN admin_remark ar ON c.complaint_id = ar.complaint_id
ORDER BY c.created_at DESC;