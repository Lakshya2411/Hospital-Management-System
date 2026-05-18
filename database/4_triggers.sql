USE hospital_management;

DROP TRIGGER IF EXISTS trg_appointment_cancelled;
DROP TRIGGER IF EXISTS trg_doctor_status_audit;

CREATE TABLE IF NOT EXISTS doctor_status_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    old_status BOOLEAN,
    new_status BOOLEAN,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(50)
);

DELIMITER //

CREATE TRIGGER trg_appointment_cancelled
AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
        UPDATE billing
        SET payment_status = 'Refunded'
        WHERE appointment_id = NEW.appointment_id AND payment_status = 'Pending';
    END IF;
END //

CREATE TRIGGER trg_doctor_status_audit
AFTER UPDATE ON doctors
FOR EACH ROW
BEGIN
    IF OLD.is_active != NEW.is_active THEN
        INSERT INTO doctor_status_audit (doctor_id, old_status, new_status, changed_by)
        VALUES (NEW.doctor_id, OLD.is_active, NEW.is_active, CURRENT_USER());
    END IF;
END //

DELIMITER ;
