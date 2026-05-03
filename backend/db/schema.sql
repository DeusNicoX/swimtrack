CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'trainer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainer_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  specialty VARCHAR(160),
  experience_years INTEGER CHECK (
    experience_years IS NULL OR experience_years >= 0
  ),
  contact_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  trainer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  modality VARCHAR(80) NOT NULL,
  location VARCHAR(180) NOT NULL,
  schedule VARCHAR(180) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS services_trainer_id_idx ON services(trainer_id);
CREATE INDEX IF NOT EXISTS services_created_at_idx ON services(created_at);
