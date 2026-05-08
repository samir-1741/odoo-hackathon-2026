-- Odoo Hackathon 2026 - Database Schema
-- Run this file to setup your database manually

-- Items Table (customize as per problem statement)
CREATE TABLE IF NOT EXISTS items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT    NOT NULL UNIQUE,
    email      TEXT    NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data (for testing)
INSERT INTO items (name, description) VALUES
    ('Sample Item 1', 'This is a test item'),
    ('Sample Item 2', 'Another test item');
