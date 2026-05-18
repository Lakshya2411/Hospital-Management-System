USE hospital_management;

DROP PROCEDURE IF EXISTS schedule_appointment;
DROP PROCEDURE IF EXISTS process_payment;

DELIMITER //

CREATE PROCEDURE schedule_appointment(
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_appointment_date DATETIME,
    IN p_reason_for_visit TEXT,
    OUT p_appointment_id INT,
    OUT p_bill_id INT
)
BEGIN
    DECLARE v_consultation_fee DECIMAL(10, 2);
    DECLARE v_conflict_count INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT consultation_fee INTO v_consultation_fee
    FROM doctors
    WHERE doctor_id = p_doctor_id AND is_active = TRUE;

    IF v_consultation_fee IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Doctor not found or inactive.';
    END IF;

    SELECT COUNT(*) INTO v_conflict_count
    FROM appointments
    WHERE doctor_id = p_doctor_id 
    AND status IN ('Scheduled')
    AND appointment_date = p_appointment_date;

    IF v_conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Doctor already has an appointment at this time.';
    END IF;

    INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason_for_visit, status)
    VALUES (p_patient_id, p_doctor_id, p_appointment_date, p_reason_for_visit, 'Scheduled');
    
    SET p_appointment_id = LAST_INSERT_ID();

    INSERT INTO billing (appointment_id, patient_id, total_amount, net_amount, payment_status)
    VALUES (p_appointment_id, p_patient_id, v_consultation_fee, v_consultation_fee, 'Pending');
    
    SET p_bill_id = LAST_INSERT_ID();

    COMMIT;
END //

CREATE PROCEDURE process_payment(
    IN p_bill_id INT,
    IN p_payment_method VARCHAR(50),
    IN p_amount_paid DECIMAL(10, 2)
)
BEGIN
    DECLARE v_net_amount DECIMAL(10, 2);
    DECLARE v_status VARCHAR(20);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT net_amount, payment_status INTO v_net_amount, v_status
    FROM billing
    WHERE bill_id = p_bill_id FOR UPDATE;

    IF v_net_amount IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bill not found.';
    END IF;

    IF v_status = 'Paid' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bill is already paid.';
    END IF;

    IF p_amount_paid >= v_net_amount THEN
        UPDATE billing
        SET payment_status = 'Paid',
            payment_method = p_payment_method,
            paid_at = CURRENT_TIMESTAMP
        WHERE bill_id = p_bill_id;
    ELSE
        UPDATE billing
        SET payment_status = 'Partially Paid',
            payment_method = p_payment_method
        WHERE bill_id = p_bill_id;
    END IF;

    COMMIT;
END //

DELIMITER ;
