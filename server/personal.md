# Chat Application Backend

## Project Overview
This is a complete Node.js + Express + MongoDB backend for a real-time chat application. It includes user authentication, chat rooms, message encryption, and is ready for Socket.IO integration.

## Features
- ✅ User registration and authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Message encryption/decryption
- ✅ Chat room management (public/private/direct)
- ✅ CRUD operations for users, messages, and chat rooms
- ✅ Input validation and error handling
- ✅ CORS configuration
- 🔄 Socket.IO ready (placeholder included)

## Folder Structure
\`\`\`
src/
├── server.js              # Main server file
├── personal.md            # This documentation file
├── config/
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── userController.js      # User-related logic
│   ├── messageController.js   # Message-related logic
│   └── chatRoomController.js  # Chat room logic
├── models/
│   ├── User.js            # User schema
│   ├── Message.js         # Message schema (with encryption)
│   └── ChatRoom.js        # Chat room schema
├── routes/
│   ├── userRoutes.js      # User API routes
│   ├── messageRoutes.js   # Message API routes
│   └── chatRoomRoutes.js  # Chat room API routes
├── utils/
│   └── auth.js            # JWT authentication middleware
└── sockets/
    └── chatSockets.js     # Socket.IO placeholder
\`\`\`

## How to Run Backend

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation Commands
\`\`\`bash
# Navigate to project directory
cd your-project-name

# Install dependencies
npm install

# Create .env file (already included)
# Make sure MongoDB is running

# Run with node
npm start

# Run with nodemon (development)
npm run dev
\`\`\`

### Server will start on:
- **Development**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Environment Variables
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
MSG_SECRET=your-message-encryption-key
\`\`\`

## API Routes

### User Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| GET | `/all` | Get all users | Yes |

#### Register User
\`\`\`javascript
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "",
    "isOnline": false
  }
}
\`\`\`

#### Login User
\`\`\`javascript
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": { ... }
}
\`\`\`

### Message Routes (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Send message | Yes |
| GET | `/chatroom/:chatRoomId` | Get messages for chat room | Yes |
| PUT | `/:messageId` | Edit message | Yes |
| DELETE | `/:messageId` | Delete message | Yes |

#### Send Message
\`\`\`javascript
POST /api/messages
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "chatRoomId": "chat-room-id",
  "content": "Hello everyone!",
  "messageType": "text"
}
\`\`\`

#### Get Messages
\`\`\`javascript
GET /api/messages/chatroom/chat-room-id?page=1&limit=50
Authorization: Bearer jwt-token
\`\`\`

### Chat Room Routes (`/api/chatrooms`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create chat room | Yes |
| GET | `/my-rooms` | Get user's chat rooms | Yes |
| GET | `/public` | Get public chat rooms | Yes |
| GET | `/:chatRoomId` | Get chat room details | Yes |
| POST | `/:chatRoomId/join` | Join chat room | Yes |
| POST | `/:chatRoomId/leave` | Leave chat room | Yes |

#### Create Chat Room
\`\`\`javascript
POST /api/chatrooms
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "name": "General Discussion",
  "description": "A place for general chat",
  "type": "public"
}
\`\`\`

## MongoDB Schemas

### User Schema
\`\`\`javascript
{
  username: String (required, unique, 3-20 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 6 chars),
  avatar: String (optional),
  isOnline: Boolean (default: false),
  lastSeen: Date (default: now),
  timestamps: true
}
\`\`\`

### Message Schema
\`\`\`javascript
{
  sender: ObjectId (ref: User, required),
  chatRoom: ObjectId (ref: ChatRoom, required),
  content: String (required, max 1000 chars),
  encryptedContent: String (required, encrypted),
  messageType: String (enum: text/image/file, default: text),
  isEdited: Boolean (default: false),
  editedAt: Date,
  readBy: [{ user: ObjectId, readAt: Date }],
  timestamps: true
}
\`\`\`

### ChatRoom Schema
\`\`\`javascript
{
  name: String (required, max 50 chars),
  description: String (optional, max 200 chars),
  type: String (enum: public/private/direct, default: public),
  members: [{
    user: ObjectId (ref: User),
    role: String (enum: admin/moderator/member),
    joinedAt: Date
  }],
  createdBy: ObjectId (ref: User, required),
  lastMessage: ObjectId (ref: Message),
  isActive: Boolean (default: true),
  timestamps: true
}
\`\`\`

## Frontend Integration

### Authentication Headers
\`\`\`javascript
// Include JWT token in requests
const token = localStorage.getItem('token');
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};
\`\`\`

### Example Frontend API Calls
\`\`\`javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Send message
const sendMessage = async (messageData, token) => {
  const response = await fetch('http://localhost:5000/api/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messageData)
  });
  return response.json();
};
\`\`\`

## Socket.IO Integration (Coming Soon)

### Placeholder Setup
The `src/sockets/chatSockets.js` file contains a placeholder for Socket.IO implementation. When ready to add real-time features:

1. Uncomment Socket.IO setup in `server.js`
2. Implement socket handlers in `chatSockets.js`
3. Add socket events for:
   - Real-time messaging
   - Typing indicators
   - User online/offline status
   - Room notifications

### Example Socket Events
\`\`\`javascript
// Client-side events to implement
socket.emit('join-room', roomId);
socket.emit('send-message', messageData);
socket.emit('typing', { roomId, username });
socket.emit('stop-typing', { roomId, username });

// Server-side events to listen for
socket.on('new-message', handleNewMessage);
socket.on('user-typing', showTypingIndicator);
socket.on('user-online', updateUserStatus);
\`\`\`

## Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Message encryption/decryption
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ MongoDB injection protection
- ✅ Error handling middleware

## Development Tips
1. **Testing**: Use Postman or Thunder Client to test API endpoints
2. **Database**: Use MongoDB Compass to view database collections
3. **Logging**: Check console for detailed error messages
4. **Environment**: Make sure MongoDB is running before starting server
5. **CORS**: Update CLIENT_URL in .env for different frontend URLs

## Next Steps
1. Add Socket.IO for real-time messaging
2. Implement file upload for images/documents
3. Add push notifications
4. Implement message reactions
5. Add user roles and permissions
6. Set up rate limiting
7. Add comprehensive testing

## Troubleshooting
- **MongoDB Connection**: Ensure MongoDB is running and URI is correct
- **JWT Errors**: Check if JWT_SECRET is set in environment
- **CORS Issues**: Verify CLIENT_URL matches your frontend URL
- **Port Conflicts**: Change PORT in .env if 5000 is occupied
