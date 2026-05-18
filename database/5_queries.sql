USE hospital_management;

SELECT 
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.contact_number,
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    d.specialization,
    a.appointment_date,
    a.status AS appointment_status,
    pr.medication_name,
    pr.dosage,
    b.net_amount,
    b.payment_status
FROM 
    patients p
JOIN 
    appointments a ON p.patient_id = a.patient_id
LEFT JOIN 
    doctors d ON a.doctor_id = d.doctor_id
LEFT JOIN 
    prescriptions pr ON a.appointment_id = pr.appointment_id
LEFT JOIN 
    billing b ON a.appointment_id = b.appointment_id
WHERE 
    p.patient_id = 1
ORDER BY 
    a.appointment_date DESC;

SELECT 
    d.specialization,
    MONTH(b.paid_at) AS month,
    YEAR(b.paid_at) AS year,
    COUNT(b.bill_id) AS total_consultations,
    SUM(b.net_amount) AS total_revenue
FROM 
    billing b
JOIN 
    appointments a ON b.appointment_id = a.appointment_id
JOIN 
    doctors d ON a.doctor_id = d.doctor_id
WHERE 
    b.payment_status = 'Paid'
GROUP BY 
    d.specialization, YEAR(b.paid_at), MONTH(b.paid_at)
ORDER BY 
    year DESC, month DESC, total_revenue DESC;

SELECT 
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    d.specialization,
    COUNT(a.appointment_id) AS total_completed_appointments,
    RANK() OVER (ORDER BY COUNT(a.appointment_id) DESC) as workload_rank
FROM 
    doctors d
LEFT JOIN 
    appointments a ON d.doctor_id = a.doctor_id 
    AND a.status = 'Completed'
    AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY 
    d.doctor_id, d.first_name, d.last_name, d.specialization;
