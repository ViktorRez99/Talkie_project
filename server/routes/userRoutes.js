const express = require("express")
const { body } = require("express-validator")
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/userController")
const auth = require("../utils/auth")

const router = express.Router()

// Validation rules
const registerValidation = [
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
]

// Routes
router.post("/register", registerValidation, registerUser)
router.post("/login", loginValidation, loginUser)
router.get("/profile", auth, getUserProfile)
router.put("/profile", auth, updateUserProfile)
router.get("/all", auth, getAllUsers)

module.exports = router
