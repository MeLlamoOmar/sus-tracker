import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";

type tokenPayload = {
  id: string;
  email: string;
}

export const authValidator = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.access_token; // Obtener el token del header Authorization o de las cookies

  if (!token) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
    return; // Si no hay token, devolver un error 401
  }

  const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "Error del servidor" });
      return;
    }

  try {
    const decodedToken = jwt.verify(token, secret) as tokenPayload; // Verificar y decodificar el token
  
    req.user = {id: decodedToken.id, email: decodedToken.email}; // Agregar la información del usuario al objeto de solicitud
    next(); // Continuar con la siguiente función middleware o ruta
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }
};