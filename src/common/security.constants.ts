// bcrypt cost factor (2^12 rounds). Bump this to strengthen password hashing;
// existing hashes keep their original cost until the user's password is re-hashed.
export const BCRYPT_SALT_ROUNDS = 12;
