-- Supporting entity records (Role and Address)
INSERT INTO roles (name, seniority_level, department) 
VALUES ('Software Developer', 'JUNIOR', 'ENGINEERING');

INSERT INTO addresses (unit_number, street_address, address_line_2, city, state_province_region, country, postal_code) 
VALUES ('1A', 'Palm Tree Lane', 'Suburb', 'Sydney', 'NSW', 'Aus', '2000');

-- 22 Employees assigned to role_id 1 and address_id 1
INSERT INTO employees (
  first_name, last_name, middle_name, pronouns, preferred_name, 
  email_address, phone_number, address_id, role_id, manager_id, 
  work_setup, employment_type, start_date, last_date, is_currently_employed
) VALUES
('Sarah', 'Jenkins', 'Marie', 'SHE_HER', 'SJ', 'sarah.jenkins@mycompany.com', '+61412345678', 1, 1, NULL, 'ON_SITE', 'FULL_TIME_PERMANENT', '2021-03-15', NULL, true),
('Alex', 'Rivera', NULL, 'HE_HIM', 'Al', 'alex.rivera@example.com', '+61498765432', 1, 1, NULL, 'HYBRID', 'FULL_TIME_PERMANENT', '2021-08-01', NULL, true),
('Michael', 'Delfino', 'Jordan', 'HE_HIM', 'Mike', 'mike.delfino@example.com', '+61411111111', 1, 1, NULL, 'HYBRID', 'FULL_TIME_PERMANENT', '2022-01-10', NULL, true),
('Emma', 'Watson', 'Charlotte', 'SHE_HER', 'Em', 'emma.watson@example.com', '+61422222222', 1, 1, NULL, 'REMOTE', 'FULL_TIME_PERMANENT', '2022-02-15', NULL, true),
('James', 'Smith', 'Alexander', 'HE_HIM', 'Jim', 'james.smith@example.com', '+61433333333', 1, 1, NULL, 'ON_SITE', 'PART_TIME_PERMANENT', '2022-03-20', NULL, true),
('Olivia', 'Brown', 'Grace', 'SHE_HER', 'Liv', 'olivia.brown@example.com', '+61444444444', 1, 1, NULL, 'HYBRID', 'FULL_TIME_PERMANENT', '2022-04-05', NULL, true),
('Liam', 'Johnson', 'Edward', 'HE_HIM', 'Lee', 'liam.johnson@example.com', '+61455555555', 1, 1, NULL, 'REMOTE', 'CONTRACTOR', '2022-05-12', NULL, true),
('Sophia', 'Taylor', 'Rose', 'SHE_HER', 'Soph', 'sophia.taylor@example.com', '+61466666666', 1, 1, NULL, 'ON_SITE', 'FULL_TIME_PERMANENT', '2022-06-18', NULL, true),
('Benjamin', 'Davies', 'Thomas', 'HE_HIM', 'Ben', 'benjamin.davies@example.com', '+61477777777', 1, 1, NULL, 'HYBRID', 'FULL_TIME_PERMANENT', '2022-07-22', NULL, true),
('Ava', 'Wilson', 'Elizabeth', 'SHE_HER', 'Ava', 'ava.wilson@example.com', '+61488888888', 1, 1, NULL, 'REMOTE', 'FULL_TIME_PERMANENT', '2022-08-30', NULL, true),
('Lucas', 'Evans', 'Henry', 'HE_HIM', 'Luke', 'lucas.evans@example.com', '+61499999999', 1, 1, NULL, 'ON_SITE', 'FULL_TIME_PERMANENT', '2022-09-14', NULL, true),
('Mia', 'Thomas', 'Jane', 'SHE_HER', 'Mia', 'mia.thomas@example.com', '+61410101010', 1, 1, NULL, 'HYBRID', 'PART_TIME_PERMANENT', '2022-10-01', NULL, true),
('Ethan', 'Roberts', 'William', 'HE_HIM', 'Eth', 'ethan.roberts@example.com', '+61420202020', 1, 1, NULL, 'REMOTE', 'FULL_TIME_PERMANENT', '2022-11-11', NULL, true),
('Isabella', 'Walker', 'Louise', 'SHE_HER', 'Bella', 'isabella.walker@example.com', '+61430303030', 1, 1, NULL, 'ON_SITE', 'FULL_TIME_PERMANENT', '2022-12-05', NULL, true),
('Noah', 'Wright', 'James', 'HE_HIM', 'Noah', 'noah.wright@example.com', '+61440404040', 1, 1, NULL, 'HYBRID', 'CONTRACTOR', '2023-01-15', NULL, true),
('Charlotte', 'Green', 'Anne', 'SHE_HER', 'Lottie', 'charlotte.green@example.com', '+61450505050', 1, 1, NULL, 'REMOTE', 'FULL_TIME_PERMANENT', '2023-02-20', NULL, true),
('Oliver', 'Hall', 'Joseph', 'HE_HIM', 'Ollie', 'oliver.hall@example.com', '+61460606060', 1, 1, NULL, 'ON_SITE', 'FULL_TIME_PERMANENT', '2023-03-10', NULL, true),
('Amelia', 'King', 'Clair', 'SHE_HER', 'Amy', 'amelia.king@example.com', '+61470707070', 1, 1, NULL, 'HYBRID', 'FULL_TIME_PERMANENT', '2023-04-18', NULL, true),
('Elijah', 'Baker', 'Daniel', 'HE_HIM', 'Eli', 'elijah.baker@example.com', '+61480808080', 1, 1, NULL, 'REMOTE', 'PART_TIME_PERMANENT', '2023-05-25', NULL, true),
('Harper', 'Adams', 'May', 'THEY_THEM', 'Harp', 'harper.adams@example.com', '+61490909090', 1, 1, NULL, 'ON_SITE', 'FULL_TIME_PERMANENT', '2023-06-30', NULL, true),
('Daniel', 'Nelson', 'Paul', 'HE_HIM', 'Dan', 'daniel.nelson@example.com', '+61401010101', 1, 1, NULL, 'HYBRID', 'FULL_TIME_PERMANENT', '2023-07-14', NULL, true),
('Evelyn', 'Carter', 'Joy', 'SHE_HER', 'Evie', 'evelyn.carter@example.com', '+61402020202', 1, 1, NULL, 'REMOTE', 'FULL_TIME_PERMANENT', '2023-08-22', NULL, true);