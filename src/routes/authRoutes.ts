import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

import { UserService } from '@/lib/UserValidator.js';
import type { User, UserDTO } from '@/model/User.js';
import db from '@/db/db.js';
import { users as userSchema } from '@/db/schemas/schema.js';
import { randomUUID } from 'crypto';


const router = Router();

// Simulación de base de datos en memoria
let users: User[] = [];

// Registro de usuario
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password }: UserDTO = req.body;
  if (!password || !email) {
    res.status(400).json({ message: 'Password y Email son requeridos' });
    return;
  }

  // Verificar si el email ya existe
  const existingUser = await db.select().from(userSchema).where(eq(userSchema.email, email)).then(rows => rows[0]);
  if (existingUser) {
    res.status(400).json({ message: 'El email ya está en uso' });
    return;
  }

  try {
    const newUser = await UserService.createUser({name, email, password});
    if (!newUser) {
      res.status(500).json({ message: 'Error al crear el usuario' });
      return;
    }
    await db.insert(userSchema).values({
      id: newUser.id,
      email: newUser.email,
      password: newUser.password,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      name: newUser.name
    })

    res.status(201).json({ message: 'Usuario registrado', status: 'ok' });
    } catch(error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }
  
});

// Login de usuario
router.post('/login', async (req: Request, res: Response) => {
  // Lógica de login aquí
  const { email, password }: {email: string, password: string} = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Email y contraseña son requeridos' });
    return;
  }
  const user = await db.select().from(userSchema).where(eq(userSchema.email, email)).then(rows => rows[0]) as User | undefined;
  if (!user) {
    res.status(401).json({ message: 'Usuario no encontrado o contraseña incorrecta' });
    return;
  }

  const isPasswordValid = await UserService.verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Contraseña incorrecta' });
    return;
  }
  // Generar token JWT
  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: 'Error del servidor, JWT_SECRET no está configurado' });
    return;
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Enviar token como cookie
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo enviar cookies seguras en producción
    sameSite: 'lax', // Evitar CSRF
  })

  res.status(200).json({ message: 'Usuario autenticado' });
});

// Logout de usuario
router.post('/logout', (req: Request, res: Response) => {
  // Lógica de logout aquí
  res.json({ message: 'Usuario desconectado'});
});

export default router;