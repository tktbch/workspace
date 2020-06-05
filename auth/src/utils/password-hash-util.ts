import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
export class PasswordHashUtil {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(stored: string, supplied: string) {
        const [hashedPassword, salt] = stored.split('.');
        const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}
