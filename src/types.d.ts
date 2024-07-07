import { User } from '@prisma/client'

export {}

declare global {
  interface Request {
    user: User
  }

  interface BigInt {
    /** Convert to BigInt to string form in JSON.stringify */
    toJSON: () => string
  }
}
