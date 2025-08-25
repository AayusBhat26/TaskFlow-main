'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinWorkspace: (workspaceId: string) => void;
  leaveWorkspace: (workspaceId: string) => void;
  sendMessage: (workspaceId: string, content: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinWorkspace: () => {},
  leaveWorkspace: () => {},
  sendMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();

  // Stabilize session user ID to prevent unnecessary socket reconnections
  const userId = session?.user?.id;
  const sessionRef = useRef(userId);
  const prevUserIdRef = useRef<string | undefined>();

  useEffect(() => {
    sessionRef.current = userId;
  }, [userId]);

  useEffect(() => {
    // Only reconnect if userId actually changed
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;

    if (!userId) {
      // Clean up existing connection when no user
      if (socket) {
        console.log('🔗 Socket: No user, disconnecting');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create real socket.io connection
    console.log('🔗 Socket: Connecting to chat server...');

    const socketInstance = io('http://localhost:8080', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 5000, // 5 second timeout
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('🔗 Socket: Connected to chat server');
      setIsConnected(true);

      // Authenticate with server
      socketInstance.emit('authenticate', {
        userId: sessionRef.current,
        username: session?.user?.username || session?.user?.name || 'User'
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('🔗 Socket: Disconnected from chat server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error: Error) => {
      console.error('🔗 Socket: Connection error:', error.message);
      setIsConnected(false);
    });

    socketInstance.on('error', (error: Error) => {
      console.error('🔗 Socket: Error:', error.message);
    });

    setSocket(socketInstance);

    return () => {
      console.log('🔗 Socket: Cleaning up connection');
      socketInstance.disconnect();
    };
  }, [userId]); // Only depend on stable userId

  const joinWorkspace = useCallback((workspaceId: string) => {
    if (socket && isConnected) {
      console.log('🔗 Socket: Joining workspace:', workspaceId);
      socket.emit('join-workspace', { workspaceId });
    }
  }, [socket, isConnected]);

  const leaveWorkspace = useCallback((workspaceId: string) => {
    if (socket && isConnected) {
      console.log('🔗 Socket: Leaving workspace:', workspaceId);
      socket.emit('leave-workspace', { workspaceId });
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((workspaceId: string, content: string) => {
    if (socket && isConnected && sessionRef.current) {
      console.log('🔗 Socket: Sending message to workspace:', workspaceId);
      socket.emit('send-message', {
        workspaceId,
        content
      });
    }
  }, [socket, isConnected]);

  const contextValue = useMemo(() => ({
    socket,
    isConnected,
    joinWorkspace,
    leaveWorkspace,
    sendMessage,
  }), [socket, isConnected, joinWorkspace, leaveWorkspace, sendMessage]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
