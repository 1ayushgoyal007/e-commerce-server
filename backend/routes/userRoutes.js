import express from 'express';
const router  = express.Router();
import { authUser, getUserProfile, registerUser, updateUserProfile , getUsers, deleteUser ,getUserById} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(protect,admin, getUsers);
router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get( protect ,getUserProfile).put( protect, updateUserProfile)
router.route('/:id').get(getUserById);
router.route('/:id').delete(protect, admin, deleteUser);


export default router;