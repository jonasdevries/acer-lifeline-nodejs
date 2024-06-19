
INSERT INTO users ("user_name", "email", "last_modified_at") VALUES ('user1', 'user1@example.com', NOW());
INSERT INTO users ("user_name", "email", "last_modified_at") VALUES ('user2', 'user2@example.com', NOW());
INSERT INTO users ("user_name", "email", "last_modified_at") VALUES ('user3', 'user3@example.com', NOW());

INSERT INTO status ("status_name", "description") VALUES ('Pending', 'Repair is pending.');
INSERT INTO status ("status_name", "description") VALUES ('In Progress', 'Repair is in progress.');
INSERT INTO status ("status_name", "description") VALUES ('Completed', 'Repair is completed.');

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF001', 'SN1234567890123456789', 'Expect discussion participant.', NOW(), 1, NOW(), 1, 1);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF002', 'SN9876543210987654321', 'Push news laugh myself.', NOW(), 2, NOW(), 2, 2);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF003', 'SN1239874561230987456', 'Six me threat much put.', NOW(), 3, NOW(), 3, 3);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF004', 'SN6543210987654321098', 'Shake stop finally continue.', NOW(), 1, NOW(), 1, 1);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF005', 'SN0987654321098765432', 'Well where fine loss turn travel.', NOW(), 2, NOW(), 2, 2);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF006', 'SN1234567890987654321', 'Sing cold according machine however blood left.', NOW(), 3, NOW(), 3, 3);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF007', 'SN9876543212345678901', 'Challenge person measure turn we.', NOW(), 1, NOW(), 1, 1);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF008', 'SN2345678901234567890', 'Clearly practice design newspaper.', NOW(), 2, NOW(), 2, 2);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF009', 'SN5678901234567890123', 'Research create ten industry before.', NOW(), 3, NOW(), 3, 3);

INSERT INTO repairs ("internal_ref", "serial_number", "description", "created_at", "created_by", "last_modified_at", "last_modified_by", "status_id")
VALUES ('REF010', 'SN8901234567890123456', 'Their value different front career fund trade probably.', NOW(), 1, NOW(), 1, 1);
