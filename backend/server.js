const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'hospital_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'OK', message: 'Backend connected to MySQL successfully!' });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: error.message });
    }
});

app.get('/api/patients', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT patient_id as id, CONCAT(first_name, " ", last_name) as name, TIMESTAMPDIFF(YEAR, dob, CURDATE()) as age, medical_history as condition_desc FROM patients');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/doctors', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT doctor_id as id, CONCAT("Dr. ", first_name, " ", last_name) as name, specialization as specialty, 4.8 as rating, (SELECT COUNT(*) FROM appointments WHERE doctor_id = doctors.doctor_id) as patients FROM doctors');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/appointments', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.appointment_id as id,
                CONCAT(p.first_name, ' ', p.last_name) as patient,
                CONCAT('Dr. ', d.first_name, ' ', d.last_name) as doctor,
                DATE_FORMAT(a.appointment_date, '%b %d, %Y') as date,
                DATE_FORMAT(a.appointment_date, '%h:%i %p') as time,
                a.status,
                a.reason_for_visit as type
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            ORDER BY a.appointment_date DESC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { patientName, doctorName, date, reason } = req.body;
        
        if (!patientName || !doctorName || !date) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Find or create Patient
        const [patients] = await pool.query('SELECT patient_id FROM patients WHERE CONCAT(first_name, " ", last_name) = ? LIMIT 1', [patientName]);
        let patientId;
        if(patients.length === 0) {
            const names = patientName.split(' ');
            const first = names[0] || 'Unknown';
            const last = names.slice(1).join(' ') || 'Patient';
            const [result] = await pool.query("INSERT INTO patients (first_name, last_name, dob) VALUES (?, ?, '2000-01-01')", [first, last]);
            patientId = result.insertId;
        } else {
            patientId = patients[0].patient_id;
        }

        // Find or create Doctor
        const docNameClean = doctorName.replace('Dr. ', '').trim();
        const [doctors] = await pool.query('SELECT doctor_id FROM doctors WHERE CONCAT(first_name, " ", last_name) = ? LIMIT 1', [docNameClean]);
        let doctorId;
        if(doctors.length === 0) {
            const names = docNameClean.split(' ');
            const first = names[0] || 'Unknown';
            const last = names.slice(1).join(' ') || 'Doctor';
            const lic = 'LIC-' + Math.floor(Math.random() * 1000000);
            const [result] = await pool.query("INSERT INTO doctors (first_name, last_name, specialization, license_number, consultation_fee) VALUES (?, ?, 'General Practice', ?, 150.00)", [first, last, lic]);
            doctorId = result.insertId;
        } else {
            doctorId = doctors[0].doctor_id;
        }

        // Using our Stored Procedure with actual user data!
        await pool.query('CALL schedule_appointment(?, ?, ?, ?, @appt_id, @bill_id)', 
            [patientId, doctorId, date, reason || 'Consultation']
        );
        
        res.json({ message: 'Appointment Scheduled Successfully via Stored Procedure!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
