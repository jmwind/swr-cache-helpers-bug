INSERT INTO
  auth.users (
    id,
    instance_id,
    ROLE,
    aud,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    encrypted_password,
    created_at,
    updated_at,
    last_sign_in_at,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
VALUES
  (
    '846ad9c5-9835-0000-0000-7ad0e7a1363b',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@demo.com',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin Person","avatar_url":"https://i.pravatar.cc/150?img=3"}',
    FALSE,
    crypt('demo', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

INSERT INTO
  auth.identities (
    provider_id,
    provider,
    user_id,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        auth.users
      WHERE
        email = 'admin@demo.com'
    ),
    'email',
    (
      SELECT
        id
      FROM
        auth.users
      WHERE
        email = 'admin@demo.com'
    ),
    json_build_object(
      'sub',
      (
        SELECT
          id
        FROM
          auth.users
        WHERE
          email = 'admin@demo.com'
      )
    ),
    NOW(),
    NOW(),
    NOW()
  );

INSERT INTO profiles (id, full_name, username, canadian)
VALUES
  ('846ad9c5-9835-0000-0000-7ad0e7a1363b', 'John Doe', 'jadam', true);
  


INSERT INTO trips (id, profile_id, country_code, trip_date)
VALUES
  (1, '846ad9c5-9835-0000-0000-7ad0e7a1363b', 'CAN', '2023-10-01'),
  (2, '846ad9c5-9835-0000-0000-7ad0e7a1363b', 'USA', '2023-11-15'),
  (3, '846ad9c5-9835-0000-0000-7ad0e7a1363b', 'POL', '2023-11-11'),
  (4, '846ad9c5-9835-0000-0000-7ad0e7a1363b', 'BR', '2023-12-25'),
  (5, '846ad9c5-9835-0000-0000-7ad0e7a1363b', 'FR', '2023-12-05');