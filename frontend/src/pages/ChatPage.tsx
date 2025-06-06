import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, useTheme, useMediaQuery, Grid } from '@mui/material';
import { ChatList } from '../components/Chat/ChatList';
import { ChatWindow } from '../components/Chat/ChatWindow';
import type { Chat } from '../services/chatService';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const listingId = searchParams.get('listingId');
    const sellerId = searchParams.get('sellerId');
    console.log('DEBUG ChatPage:', { user, listingId, sellerId });

    if (listingId && sellerId && user) {
      const newChat: Chat = {
        id: 'new',
        participants: [user.id, sellerId],
        listingId,
        updatedAt: new Date(),
      };
      setSelectedChat(newChat);
    }
  }, [searchParams, user]);

  if (!user) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Chat-Liste */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: '100%',
            borderRight: 1,
            borderColor: 'divider',
            display: { xs: selectedChat ? 'none' : 'block', md: 'block' },
          }}
        >
          <ChatList onChatSelect={handleChatSelect} />
        </Grid>

        {/* Chat-Fenster */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            height: '100%',
            display: { xs: selectedChat ? 'block' : 'none', md: 'block' },
          }}
        >
          {selectedChat ? (
            <ChatWindow
              listingId={selectedChat.listingId}
              receiverId={selectedChat.participants.find(p => p !== user?.id) || ''}
              receiverName="Chat-Partner" // Hier sollten wir den Namen aus dem User-Service holen
              receiverAvatar=""
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
              }}
            >
              {!isMobile && (
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  Wähle einen Chat aus, um Nachrichten zu senden
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}; 