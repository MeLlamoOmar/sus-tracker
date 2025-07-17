import { Router} from 'express';
import { getLogedUser, loginUser, logoutUser, registerUser } from '@/controller/authController.js';
// import { randomUUID } from 'crypto';


const router = Router();

// Registro de usuario
router.post('/register', registerUser);

// Login de usuario
router.post('/login', loginUser);

// Logout de usuario
router.post('/logout', logoutUser);

router.get('/user', getLogedUser)

export default router;