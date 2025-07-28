import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

import type { User, UserDTO } from './../model/User.js';
import db from './../db/db.js';
import { users as userSchema } from './../db/schemas/schema.js';
import { UserService } from './../lib/UserValidator.js';

export const registerUser = async (req: Request, res: Response) => {
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
}

export const loginUser = async (req: Request, res: Response) => {
  // Lógica de login aquí
  const { email, password }: {email: string, password: string} = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Email y contraseña son requeridos' });
    return;
  }
  const user = await db.select().from(userSchema).where(eq(userSchema.email, email)).then(rows => rows[0]);
  if (!user) {
    res.status(401).json({ message: 'Usuario no encontrado o contraseña incorrecta' });
    return;
  }

  const isPasswordValid = await UserService.verifyPassword(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Contraseña incorrecta' });
    return;
  }
  // Generar token JWT
  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: 'Error del servidor, JWT_SECRET no está configurado' });
    return;
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Enviar token como cookie
  res.cookie('access_token', token, {
    httpOnly: process.env.NODE_ENV !== 'development', // Habilitar httpOnly en producción
    secure: process.env.NODE_ENV === 'production', // Solo enviar cookies seguras en producción
    sameSite: 'lax', // Evitar CSRF
  })

  res.status(200).json({ message: 'Usuario autenticado' });
}

export const logoutUser = (_: Request, res: Response) => {
  // Eliminar cookie de sesión
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo eliminar cookies seguras en producción
    sameSite: 'lax', // Evitar CSRF
  });
  res.status(200).json({ message: 'Usuario desconectado' });
}

export const getLogedUser = async (req: Request, res: Response) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ message: 'No autenticado' });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'Error del servidor, JWT_SECRET no está configurado' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string, email: string, name: string };
    const user = await db.select().from(userSchema).where(eq(userSchema.id, decoded.id)).then(rows => rows[0]);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.status(200).json({ user: {
      name: user.name,
      email: user.email,
    } });
  } catch (error) {
    // console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}