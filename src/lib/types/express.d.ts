import { JwtPayload } from "@/middleware/authenticate"; // Asegúrate de que importe correctamente

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}