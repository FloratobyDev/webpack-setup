#!/bin/bash

# Exit script if any command fails
set -e

echo "Rolling back the latest migration..."
npx knex migrate:rollback

echo "Migrating to the latest version..."
npx knex migrate:latest

echo "Seeding the database..."
npx knex seed:run

echo "Database reset and seeded successfully!"
