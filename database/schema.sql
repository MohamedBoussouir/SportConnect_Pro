
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    erp_capacity INT NOT NULL CHECK (erp_capacity > 0),
    is_divisible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE associations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE families (
    id SERIAL PRIMARY KEY,
    family_name VARCHAR(100) NOT NULL,
    quotient_familial NUMERIC(10, 2) NOT NULL CHECK (quotient_familial >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    family_id INT REFERENCES families(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    is_resident BOOLEAN DEFAULT TRUE,
    has_pass_sport BOOLEAN DEFAULT FALSE,
    medical_cert_date DATE NOT NULL,
    medical_status VARCHAR(30) DEFAULT 'valid' CHECK (medical_status IN ('valid', 'medical_non_compliant')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    association_id INT NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
    facility_id INT NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    sub_zone VARCHAR(50), 
    name VARCHAR(150) NOT NULL,
    target_category VARCHAR(50) NOT NULL, 
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    max_capacity INT NOT NULL CHECK (max_capacity > 0),
    is_high_risk BOOLEAN DEFAULT FALSE, 
    day_of_week VARCHAR(20) NOT NULL, 
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_time_order CHECK (start_time < end_time)
);


CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    activity_id INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    final_price NUMERIC(10, 2) NOT NULL CHECK (final_price >= 15.00), 
    payment_plan VARCHAR(20) DEFAULT '1x' CHECK (payment_plan IN ('1x', '3x')),
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_member_activity UNIQUE(activity_id, member_id)
);


CREATE TABLE waiting_list (
    id SERIAL PRIMARY KEY,
    activity_id INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    priority_score INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'waiting' CHECK (status IN ('waiting', 'promoted_pending', 'expired')),
    deadline_confirmation TIMESTAMP, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_waiting_member_activity UNIQUE(activity_id, member_id)
);


CREATE INDEX idx_registrations_activity ON registrations(activity_id, status);
CREATE INDEX idx_waiting_list_priority ON waiting_list(activity_id, priority_score DESC, created_at ASC);
CREATE INDEX idx_activities_schedule ON activities(facility_id, day_of_week, start_time, end_time);