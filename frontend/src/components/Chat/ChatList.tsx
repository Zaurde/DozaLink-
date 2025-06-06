import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
  Badge,
  CircularProgress,
} from '@mui/material';
import { chatService } from '../../services/chatService';
import type { Chat } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 10000); // Polling alle 10 Sekunden
    return () => clearInterval(interval);
  }, []);

  const loadChats = async () => {
    if (!user) return;
    try {
      const userChats = await chatService.getUserChats(user.id);
      setChats(userChats);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Chats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (chats.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        p={3}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          Keine aktiven Chats vorhanden
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {chats.map((chat, index) => (
        <React.Fragment key={chat.id}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => onChatSelect(chat)}
              sx={{
                py: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={!chat.lastMessage?.read}
                >
                  <Avatar src={chat.participants[0] === user?.id ? chat.participants[1] : chat.participants[0]} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" noWrap>
                    {chat.participants[0] === user?.id ? chat.participants[1] : chat.participants[0]}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {chat.lastMessage?.content || 'Keine Nachrichten'}
                  </Typography>
                }
              />
              {chat.lastMessage && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
          {index < chats.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}; 