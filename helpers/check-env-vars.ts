const requiredEnvVars = [
  'PORT',
  'DATABASE_URL',
  'CORS_ALLOW_ORIGINS',
  'NODE_ENV',
  'SECRET_KEY',
  'LIARA_ENDPOINT',
  'LIARA_BUCKET_NAME',
  'LIARA_ACCESS_KEY',
  'LIARA_SECRET_KEY',
]

export function detectEnvVarsNotSet(): boolean {
  return requiredEnvVars.map((envKey) => !!process.env[envKey]).includes(false)
}

export default detectEnvVarsNotSet
