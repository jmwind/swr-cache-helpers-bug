CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    username TEXT NOT NULL,
    canadian BOOLEAN NOT NULL
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    trip_date TIMESTAMPTZ NOT NULL,
    country_code TEXT NOT NULL
);