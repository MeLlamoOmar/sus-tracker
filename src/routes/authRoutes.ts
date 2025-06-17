import { UserService } from '@/lib/UserValidator.js';
import type { User, UserDTO } from '@/model/User.js';
import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    res.status(400).json({ message: 'El email ya está en uso' });
    return;
  }

  try {
    const hashedPassword = await UserService.hashPassword(password);
    const newUser = await UserService.createUser({name, email, password: hashedPassword});
    if (!newUser) {
      res.status(500).json({ message: 'Error al crear el usuario' });
      return;
    }
    users.push(newUser);
    console.log(newUser.passwordHash)
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
  const user = users.find(u => u.email === email);
  if (!user) {
    res.status(401).json({ message: 'Usuario no encontrado o contraseña incorrecta' });
    return;
  }

  console.log(user.passwordHash);
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
  res.json({ message: 'Usuario desconectado' });
});

export default router;