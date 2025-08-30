const mongoose = require("mongoose")
const crypto = require("crypto")

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    encryptedContent: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Encrypt message before saving
messageSchema.pre("save", function (next) {
  if (!this.isModified("content")) return next()

  try {
    const cipher = crypto.createCipher("aes-256-cbc", process.env.MSG_SECRET)
    let encrypted = cipher.update(this.content, "utf8", "hex")
    encrypted += cipher.final("hex")
    this.encryptedContent = encrypted
    next()
  } catch (error) {
    next(error)
  }
})

// Decrypt message method
messageSchema.methods.getDecryptedContent = function () {
  try {
    const decipher = crypto.createDecipher("aes-256-cbc", process.env.MSG_SECRET)
    let decrypted = decipher.update(this.encryptedContent, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (error) {
    return this.content
  }
}

module.exports = mongoose.model("Message", messageSchema)
