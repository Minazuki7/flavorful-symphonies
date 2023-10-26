import bcrypt from 'bcryptjs';

export default function hash(str: string, sync?: boolean) {
  const rounds = 10;

  if (sync) {
    return bcrypt.hashSync(str, rounds);
  }

  return bcrypt.hash(str, rounds);
}
