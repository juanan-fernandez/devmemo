# Seed Data Specification

## Overview

Add to seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos.

## Requirements

### User

Add the next user to the User table

- **Email:** demo@devmemo.com
- **Name:** Demo User
- **Password:** 12345678 (hash with bcryptjs, 12 rounds)
- **emailVerified:** current date
- **image:** https://gravatar.com/avatar/6e876962302db3a50286689eb0bef3c5?s=200&d=robohash&r=x

### Collections & Items

Use the data in the file @lib/mockdata.ts to populate the database
