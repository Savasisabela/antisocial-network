DROP TABLE IF EXISTS reset;

 CREATE TABLE reset(
     email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
     code VARCHAR(255) NOT NULL CHECK (code != ''),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );