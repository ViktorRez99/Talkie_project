const ChatRoom = require("../models/ChatRoom")
const Message = require("../models/Message")

// Create Chat Room
const createChatRoom = async (req, res) => {
  try {
    const { name, description, type = "public" } = req.body
    const createdBy = req.user.userId

    const chatRoom = new ChatRoom({
      name,
      description,
      type,
      createdBy,
      members: [
        {
          user: createdBy,
          role: "admin",
        },
      ],
    })

    await chatRoom.save()
    await chatRoom.populate("members.user", "username avatar")
    await chatRoom.populate("createdBy", "username avatar")

    res.status(201).json({
      message: "Chat room created successfully",
      chatRoom,
    })
  } catch (error) {
    console.error("Create chat room error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get All Chat Rooms for User
const getUserChatRooms = async (req, res) => {
  try {
    const userId = req.user.userId

    const chatRooms = await ChatRoom.find({
      "members.user": userId,
      isActive: true,
    })
      .populate("members.user", "username avatar isOnline")
      .populate("createdBy", "username avatar")
      .populate("lastMessage", "content createdAt sender")
      .sort({ updatedAt: -1 })

    res.json({ chatRooms })
  } catch (error) {
    console.error("Get chat rooms error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get Chat Room Details
const getChatRoomDetails = async (req, res) => {
  try {
    const { chatRoomId } = req.params
    const userId = req.user.userId

    const chatRoom = await ChatRoom.findById(chatRoomId)
      .populate("members.user", "username avatar isOnline lastSeen")
      .populate("createdBy", "username avatar")

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" })
    }

    // Check if user is a member
    const isMember = chatRoom.members.some((member) => member.user._id.toString() === userId)
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this chat room" })
    }

    res.json({ chatRoom })
  } catch (error) {
    console.error("Get chat room details error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Join Chat Room
const joinChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params
    const userId = req.user.userId

    const chatRoom = await ChatRoom.findById(chatRoomId)
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" })
    }

    // Check if user is already a member
    const isMember = chatRoom.members.some((member) => member.user.toString() === userId)
    if (isMember) {
      return res.status(400).json({ message: "You are already a member of this chat room" })
    }

    // Add user to members
    chatRoom.members.push({
      user: userId,
      role: "member",
    })

    await chatRoom.save()
    await chatRoom.populate("members.user", "username avatar")

    res.json({
      message: "Successfully joined chat room",
      chatRoom,
    })
  } catch (error) {
    console.error("Join chat room error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Leave Chat Room
const leaveChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params
    const userId = req.user.userId

    const chatRoom = await ChatRoom.findById(chatRoomId)
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" })
    }

    // Remove user from members
    chatRoom.members = chatRoom.members.filter((member) => member.user.toString() !== userId)

    await chatRoom.save()

    res.json({ message: "Successfully left chat room" })
  } catch (error) {
    console.error("Leave chat room error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get Public Chat Rooms
const getPublicChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({
      type: "public",
      isActive: true,
    })
      .populate("createdBy", "username avatar")
      .select("name description type members createdBy createdAt")
      .sort({ createdAt: -1 })

    res.json({ chatRooms })
  } catch (error) {
    console.error("Get public chat rooms error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  createChatRoom,
  getUserChatRooms,
  getChatRoomDetails,
  joinChatRoom,
  leaveChatRoom,
  getPublicChatRooms,
}
