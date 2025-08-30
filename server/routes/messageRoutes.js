const express = require("express")
const { body } = require("express-validator")
const { sendMessage, getMessages, editMessage, deleteMessage } = require("../controllers/messageController")
const auth = require("../utils/auth")

const router = express.Router()

// Validation rules
const messageValidation = [
  body("content")
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),
  body("chatRoomId").notEmpty().withMessage("Chat room ID is required").isMongoId().withMessage("Invalid chat room ID"),
]

// Routes
router.post("/", auth, messageValidation, sendMessage)
router.get("/chatroom/:chatRoomId", auth, getMessages)
router.put("/:messageId", auth, editMessage)
router.delete("/:messageId", auth, deleteMessage)

module.exports = router
