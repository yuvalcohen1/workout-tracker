import { User, UserPayload } from '../types';

// In-memory database for simplicity
// In production, replace with actual database (MongoDB, PostgreSQL, etc.)
export class UserDatabase {
  private static users: User[] = [];
  private static nextId = 1;

  static async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  static async create(email: string, hashedPassword: string): Promise<UserPayload> {
    const user: User = {
      id: String(this.nextId++),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    };

    this.users.push(user);

    return {
      id: user.id,
      email: user.email,
    };
  }

  static async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users[userIndex].password = hashedPassword;
    return true;
  }

  static async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  // Helper method for development - remove in production
  static getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }
}