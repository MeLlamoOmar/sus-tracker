import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env

if (!TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not set in environment variables')
}
if (!TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not set in environment variables')
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN
  }
})
