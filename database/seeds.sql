-- database/seeds.sql

INSERT INTO facilities (name, address, erp_capacity, is_divisible) VALUES
('Gymnase Victor Hugo', '12 Avenue de la Liberté', 120, true),
('Piscine Olympique Métropolitaine', '5 Boulevard du Sport', 80, false),
('Dojo Central Municipal', '8 Rue des Arts Martiaux', 50, false);


INSERT INTO associations (name, contact_email, phone) VALUES
('Association Omnisports Municipale', 'contact@aom-sport.fr', '0142334455'),
('Club Nautique Métropolitain', 'info@nautique-club.fr', '0145667788'),
('Dojo Karaté & Boxe Solidaire', 'combat@dojoclub.fr', '0148990011');


INSERT INTO families (family_name, quotient_familial) VALUES
('Benali', 550.00),  
('Dupont', 750.00),  
('Martin', 1200.00);  


INSERT INTO members (family_id, first_name, last_name, birth_date, is_resident, has_pass_sport, medical_cert_date, medical_status) VALUES
(1, 'Karim', 'Benali', '2016-04-15', true, true, CURRENT_DATE - INTERVAL '6 months', 'valid'),    
(1, 'Amina', 'Benali', '2014-08-20', true, false, CURRENT_DATE - INTERVAL '1 year', 'valid'),      
(2, 'Thomas', 'Dupont', '2012-03-10', true, false, CURRENT_DATE - INTERVAL '8 months', 'valid'),   
(3, 'Julien', 'Martin', '1995-11-25', false, false, CURRENT_DATE - INTERVAL '2 years', 'valid');  


INSERT INTO activities (association_id, facility_id, name, target_category, base_price, max_capacity, is_high_risk, day_of_week, start_time, end_time) VALUES
(1, 1, 'Basket-ball U11', 'Benjamin (U11)', 120.00, 15, false, 'Mercredi', '14:00:00', '15:30:00'),
(2, 2, 'Natation Perfectionnement', 'Tous publics', 180.00, 20, false, 'Samedi', '10:00:00', '11:30:00'),
(3, 3, 'Boxe Anglaise Compétition', 'Senior', 210.00, 12, true, 'Lundi', '18:30:00', '20:00:00');