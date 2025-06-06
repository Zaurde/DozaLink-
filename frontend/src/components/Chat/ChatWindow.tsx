import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { chatService } from '../../services/chatService';
import type { Message } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

interface ChatWindowProps {
  listingId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  listingId,
  receiverId,
  receiverName,
  receiverAvatar,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Polling alle 5 Sekunden
    return () => clearInterval(interval);
  }, [listingId, receiverId]);

  const loadMessages = async () => {
    if (!user) return;
    try {
      const history = await chatService.getChatHistory(listingId, user.id, receiverId);
      setMessages(history);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const messageData = {
        senderId: user.id,
        receiverId,
        listingId,
        content: newMessage.trim(),
      };

      await chatService.sendMessage(messageData);
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Chat-Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar src={receiverAvatar} alt={receiverName} />
        <Typography variant="h6">{receiverName}</Typography>
      </Box>

      <Divider />

      {/* Nachrichtenbereich */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.senderId === user?.id ? 'flex-end' : 'flex-start',
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: message.senderId === user?.id ? 'primary.main' : 'grey.100',
                color: message.senderId === user?.id ? 'primary.contrastText' : 'text.primary',
                p: 2,
                borderRadius: 2,
                position: 'relative',
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: 0,
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                }}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Eingabebereich */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nachricht schreiben..."
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}; 