const express = require("express")
const { body } = require("express-validator")
const {
  createChatRoom,
  getUserChatRooms,
  getChatRoomDetails,
  joinChatRoom,
  leaveChatRoom,
  getPublicChatRooms,
} = require("../controllers/chatRoomController")
const auth = require("../utils/auth")

const router = express.Router()

// Validation rules
const chatRoomValidation = [
  body("name")
    .notEmpty()
    .withMessage("Chat room name is required")
    .isLength({ max: 50 })
    .withMessage("Chat room name cannot exceed 50 characters"),
  body("description").optional().isLength({ max: 200 }).withMessage("Description cannot exceed 200 characters"),
  body("type").optional().isIn(["public", "private", "direct"]).withMessage("Invalid chat room type"),
]

// Routes
router.post("/", auth, chatRoomValidation, createChatRoom)
router.get("/my-rooms", auth, getUserChatRooms)
router.get("/public", auth, getPublicChatRooms)
router.get("/:chatRoomId", auth, getChatRoomDetails)
router.post("/:chatRoomId/join", auth, joinChatRoom)
router.post("/:chatRoomId/leave", auth, leaveChatRoom)

module.exports = router
