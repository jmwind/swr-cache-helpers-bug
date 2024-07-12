

INSERT INTO profiles (id, full_name, username, canadian)
VALUES
  (1, 'John Doe', 'jadam', true),
  (2, 'Jane Smith', 'jane', false),
  (3, 'Alice Jones', 'alice', false);


INSERT INTO trips (id, profile_id, country_code, trip_date)
VALUES
  (1, 1, 'CAN', '2023-10-01'),
  (2, 2, 'USA', '2023-11-15'),
  (3, 2, 'POL', '2023-11-11'),
  (4, 2, 'BR', '2023-12-25'),
  (5, 3, 'FR', '2023-12-05');