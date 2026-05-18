USE hospital_management;

INSERT INTO users (username, password_hash, role) VALUES 
('admin_user', 'hashed_pass_1', 'Admin'),
('dr_chen', 'hashed_pass_2', 'Doctor'),
('dr_connor', 'hashed_pass_3', 'Doctor'),
('receptionist_jane', 'hashed_pass_4', 'Receptionist');

INSERT INTO patients (user_id, first_name, last_name, dob, gender, blood_group, contact_number, address, medical_history) VALUES 
(NULL, 'Sarah', 'Jenkins', '1992-05-14', 'Female', 'O+', '555-0101', '123 Elm St', 'Healthy'),
(NULL, 'Robert', 'Fox', '1974-08-22', 'Male', 'A-', '555-0102', '456 Oak St', 'Hypertension'),
(NULL, 'Esther', 'Howard', '1997-11-05', 'Female', 'B+', '555-0103', '789 Pine St', 'Asthma');

INSERT INTO doctors (user_id, first_name, last_name, specialization, license_number, consultation_fee) VALUES 
(2, 'Michael', 'Chen', 'General Practice', 'LIC-1001', 100.00),
(3, 'Sarah', 'Connor', 'Cardiology', 'LIC-1002', 200.00),
(NULL, 'Gregory', 'House', 'Diagnostic Medicine', 'LIC-1003', 300.00);

INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason_for_visit) VALUES 
(1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Scheduled', 'Annual Checkup'),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Completed', 'Cardiology Consultation'),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Scheduled', 'Diagnostics');
