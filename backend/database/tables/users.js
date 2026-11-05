const users = `

  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TYPE IF EXISTS role_enum CASCADE;
  CREATE TYPE role_enum AS ENUM ('student', 'staff', 'admin');

CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      school_id VARCHAR(100) NOT NULL UNIQUE,
      role role_enum NOT NULL,
      password TEXT NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      phone TEXT,
      rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

`;

export default users;
