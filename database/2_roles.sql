USE hospital_management;

CREATE ROLE IF NOT EXISTS 'db_admin', 'db_doctor', 'db_receptionist', 'db_patient';

GRANT ALL PRIVILEGES ON hospital_management.* TO 'db_admin';

GRANT SELECT, INSERT, UPDATE ON hospital_management.patients TO 'db_receptionist';
GRANT SELECT, INSERT, UPDATE ON hospital_management.appointments TO 'db_receptionist';
GRANT SELECT, INSERT, UPDATE ON hospital_management.billing TO 'db_receptionist';
GRANT SELECT ON hospital_management.doctors TO 'db_receptionist';

GRANT SELECT ON hospital_management.patients TO 'db_doctor';
GRANT SELECT, UPDATE ON hospital_management.appointments TO 'db_doctor';
GRANT SELECT, INSERT, UPDATE ON hospital_management.prescriptions TO 'db_doctor';
GRANT SELECT ON hospital_management.doctors TO 'db_doctor';

GRANT SELECT ON hospital_management.patients TO 'db_patient';
GRANT SELECT ON hospital_management.appointments TO 'db_patient';
GRANT SELECT ON hospital_management.prescriptions TO 'db_patient';
GRANT SELECT ON hospital_management.billing TO 'db_patient';
