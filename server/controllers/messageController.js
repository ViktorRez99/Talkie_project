const Message = require("../models/Message")
const ChatRoom = require("../models/ChatRoom")

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { chatRoomId, content, messageType = "text" } = req.body
    const senderId = req.user.userId

    // Check if chat room exists and user is a member
    const chatRoom = await ChatRoom.findById(chatRoomId)
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" })
    }

    const isMember = chatRoom.members.some((member) => member.user.toString() === senderId)
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this chat room" })
    }

    // Create message
    const message = new Message({
      sender: senderId,
      chatRoom: chatRoomId,
      content,
      messageType,
    })

    await message.save()

    // Update chat room's last message
    chatRoom.lastMessage = message._id
    await chatRoom.save()

    // Populate sender info
    await message.populate("sender", "username avatar")

    res.status(201).json({
      message: "Message sent successfully",
      data: {
        ...message.toObject(),
        content: message.getDecryptedContent(),
      },
    })
  } catch (error) {
    console.error("Send message error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get Messages for Chat Room
const getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params
    const { page = 1, limit = 50 } = req.query
    const userId = req.user.userId

    // Check if user is a member of the chat room
    const chatRoom = await ChatRoom.findById(chatRoomId)
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" })
    }

    const isMember = chatRoom.members.some((member) => member.user.toString() === userId)
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this chat room" })
    }

    // Get messages with pagination
    const messages = await Message.find({ chatRoom: chatRoomId })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Decrypt messages
    const decryptedMessages = messages.map((message) => ({
      ...message.toObject(),
      content: message.getDecryptedContent(),
    }))

    res.json({
      messages: decryptedMessages.reverse(),
      currentPage: page,
      totalPages: Math.ceil((await Message.countDocuments({ chatRoom: chatRoomId })) / limit),
    })
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Edit Message
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const { content } = req.body
    const userId = req.user.userId

    const message = await Message.findById(messageId)
    if (!message) {
      return res.status(404).json({ message: "Message not found" })
    }

    // Check if user is the sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own messages" })
    }

    // Update message
    message.content = content
    message.isEdited = true
    message.editedAt = new Date()
    await message.save()

    await message.populate("sender", "username avatar")

    res.json({
      message: "Message updated successfully",
      data: {
        ...message.toObject(),
        content: message.getDecryptedContent(),
      },
    })
  } catch (error) {
    console.error("Edit message error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete Message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const userId = req.user.userId

    const message = await Message.findById(messageId)
    if (!message) {
      return res.status(404).json({ message: "Message not found" })
    }

    // Check if user is the sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own messages" })
    }

    await Message.findByIdAndDelete(messageId)

    res.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("Delete message error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
}
