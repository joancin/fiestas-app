// This file is no longer used for client-side validation of access codes.
// For security, access codes must be managed and validated on the backend.

// ACTION REQUIRED:
// 1. Create a new table in your Supabase project named `access_codes`.
// 2. Define the columns:
//    - `id`: bigint (primary key, auto-incrementing)
//    - `code`: text (unique, not null)
//    - `created_at`: timestamp with time zone (default: now())
//    - `used_by`: uuid (foreign key to `profiles.id`, nullable)
//    - `used_at`: timestamp with time zone (nullable)
// 3. Populate this table with the access codes you want to distribute.
//
// The registration logic in `services/api.ts` now expects this table to exist
// and will validate codes against it.

export {};
