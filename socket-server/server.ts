import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '../node_modules/@prisma/client/index';
import { config } from 'dotenv';

// Load environment variables from parent directory
config({ path: '../.env' });

const prisma = new PrismaClient();
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store active users and their workspaces
const activeUsers = new Map<string, {
  userId: string;
  username: string;
  socketId: string;
  workspaceId?: string;
}>();

io.on('connection', (socket) => {

  // Handle user authentication
  socket.on('authenticate', async (data: { userId: string; username: string }) => {
    try {
      activeUsers.set(socket.id, {
        userId: data.userId,
        username: data.username,
        socketId: socket.id
      });

    } catch (error) {
      console.error('❌ Authentication error:', error);
      socket.emit('auth-error', { message: 'Authentication failed' });
    }
  });

  // Handle joining workspace chat
  socket.on('join-workspace', async (data: { workspaceId: string }) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Leave previous workspace if any
      if (user.workspaceId) {
        socket.leave(`workspace:${user.workspaceId}`);
      }

      // Join new workspace
      socket.join(`workspace:${data.workspaceId}`);
      user.workspaceId = data.workspaceId;
      activeUsers.set(socket.id, user);


      // Notify others in the workspace
      socket.to(`workspace:${data.workspaceId}`).emit('user-joined', {
        userId: user.userId,
        username: user.username
      });

    } catch (error) {
      console.error('❌ Join workspace error:', error);
      socket.emit('error', { message: 'Failed to join workspace' });
    }
  });

  // Handle leaving workspace chat
  socket.on('leave-workspace', async (data: { workspaceId: string }) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    socket.leave(`workspace:${data.workspaceId}`);
    user.workspaceId = undefined;
    activeUsers.set(socket.id, user);


    // Notify others in the workspace
    socket.to(`workspace:${data.workspaceId}`).emit('user-left', {
      userId: user.userId,
      username: user.username
    });
  });

  // Handle new message broadcast
  socket.on('message-created', (data: { workspaceId: string; message: any }) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user) {
        return;
      }


      // Broadcast the message to ALL users in the workspace (including sender)
      io.to(`workspace:${data.workspaceId}`).emit('new-message', data.message);
      
    } catch (error) {
      console.error('❌ Error broadcasting message:', error);
      socket.emit('error', { message: 'Failed to broadcast message' });
    }
  });

  // Handle workspace messages (legacy - can be removed later)
  socket.on('send-message', async (data: { workspaceId: string; content: string }) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }


      // Save message to database
      const message = await prisma.chatMessage.create({
        data: {
          content: data.content,
          authorId: user.userId,
          workspaceId: data.workspaceId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            }
          }
        }
      });


      // Broadcast to all users in the workspace (including sender)
      io.to(`workspace:${data.workspaceId}`).emit('new-message', message);
      

    } catch (error) {
      console.error('❌ Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      
      // Notify workspace if user was in one
      if (user.workspaceId) {
        socket.to(`workspace:${user.workspaceId}`).emit('user-left', {
          userId: user.userId,
          username: user.username
        });
      }
      
      activeUsers.delete(socket.id);
    }
  });

  // Handle socket errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

const PORT = process.env.PORT || process.env.SOCKET_PORT || 8080;

httpServer.listen(PORT, () => {
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  httpServer.close();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  httpServer.close();
});
