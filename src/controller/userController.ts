import type { User, UserDTO } from './../model/User.js';
import { randomUUID } from 'crypto';
import type { Request, Response } from "express";
import { UserService } from './../lib/UserValidator.js';

// Simulación de base de datos en memoria
let users: User[] = [];

// Crear usuario
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password }: UserDTO = req.body;
  if (!password || !email) {
    res.status(400).json({ message: 'Nombre y email son requeridos' });
    return;
  }

  // Validación de email y contraseña
  UserService.validateEmail(email);
  UserService.validatePassword(password);

  // Verificar si el email ya existe
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    res.status(400).json({ message: 'El email ya está en uso' });
    return;
  }
  // Crear el usuario
  try {
    const hashedPassword = await UserService.hashPassword(password);
    const newUser: User = {
      id: randomUUID(),
      email,
      passwordHash: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      name
    };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todos los usuarios
export const getUsers = (req: Request, res: Response) => {
  res.json(users);
};

// Obtener usuario por ID
export const getUserById = (req: Request, res: Response) => {
  const user = users.find(user => user.id === req.params.id);
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  res.json(user);
};

// Actualizar usuario
export const updateUser = (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  const { name, email } = req.body;
  UserService.validateEmail(email);
  if (name && name.length < 3) {
    res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });
    return;
  }
  users[userIndex] = {...user, name, email, updatedAt: Date.now() };
  res.json(user);
};

// Eliminar usuario
export const deleteUser = (req: Request, res: Response) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  users.splice(userIndex, 1);
  res.status(204).send();
};