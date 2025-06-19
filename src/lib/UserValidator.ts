import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto';

import type { User, UserDTO } from '@/model/User.js';
import { users as userSchema } from '@/db/schemas/schema.js';

export class UserService {
  static validatePassword(password: string) {
    // Validación de contraseña: al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    // if (!passwordRegex.test(password)) {
    //   throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
    // }

    if (password.length < 5) {
      throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
    }
  }

  static validateEmail(email: string) {
    // Validación de email: formato básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El email no es válido.');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = 10; // Número de rondas de sal
    return bcrypt.hash(password.trim(), salt);
  }

   static async createUser ({email, password, name}: UserDTO): Promise<typeof userSchema.$inferInsert | undefined> {
    // Validación de email y contraseña
    UserService.validateEmail(email);
    UserService.validatePassword(password);

    // Crear el usuario
    try {
      const hashedPassword = await UserService.hashPassword(password);
      const newUser: typeof userSchema.$inferInsert = {
        id: randomUUID(),
        email,
        password: hashedPassword,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name
      };
      return newUser;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return undefined
    }
  };

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}