CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "user_name" VARCHAR(50) UNIQUE NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "last_modified_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE status (
    "id" SERIAL PRIMARY KEY,
    "status_name" VARCHAR(50) UNIQUE NOT NULL,
    "description" TEXT
);

CREATE TABLE repairs (
    "id" SERIAL PRIMARY KEY,
    "internal_ref" VARCHAR(11) UNIQUE NOT NULL,
    "serial_number" VARCHAR(22) UNIQUE NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "created_by" INTEGER NOT NULL REFERENCES users("id"),
    "last_modified_at" TIMESTAMP DEFAULT NOW(),
    "last_modified_by" INTEGER REFERENCES users("id"),
    "status_id" INTEGER NOT NULL REFERENCES status("id")
);