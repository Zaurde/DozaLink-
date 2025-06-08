import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Badge,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  profileImage?: string;
  online: boolean;
  lastSeen?: string;
}

export function Chat() {
  const { user, token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lade Chat-Partner
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Fehler beim Laden der Chat-Partner');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        showSnackbar('Fehler beim Laden der Chat-Partner', 'error');
      }
    };
    fetchUsers();
  }, [token]);

  // Lade Nachrichten für ausgewählten User
  useEffect(() => {
    if (!selectedUser) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chat/messages/${selectedUser.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (!response.ok) throw new Error('Fehler beim Laden der Nachrichten');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        showSnackbar('Fehler beim Laden der Nachrichten', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    // Polling für neue Nachrichten
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedUser, token]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: newMessage
        })
      });

      if (!response.ok) throw new Error('Fehler beim Senden der Nachricht');
      
      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      showSnackbar('Fehler beim Senden der Nachricht', 'error');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Chat-Partner Liste */}
      <Paper sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
        <List>
          {users.map((chatUser) => (
            <ListItem key={chatUser.id} disablePadding>
              <ListItemButton
                selected={selectedUser?.id === chatUser.id}
                onClick={() => setSelectedUser(chatUser)}
              >
                <ListItemAvatar>
                  <Badge
                    color={chatUser.online ? 'success' : 'default'}
                    variant="dot"
                    overlap="circular"
                  >
                    <Avatar src={chatUser.profileImage} alt={chatUser.name}>
                      {chatUser.name[0]}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={chatUser.name}
                  secondary={chatUser.online ? 'Online' : 'Offline'}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat-Bereich */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            {/* Chat-Header */}
            <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={selectedUser.profileImage} alt={selectedUser.name} sx={{ mr: 2 }}>
                  {selectedUser.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{selectedUser.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.online ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Nachrichten */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.senderId === user?.id ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: message.senderId === user?.id ? 'primary.main' : 'white',
                        color: message.senderId === user?.id ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatTime(message.createdAt)}
                      </Typography>
                    </Paper>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Nachrichten-Eingabe */}
            <Paper
              component="form"
              onSubmit={handleSendMessage}
              sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nachricht schreiben..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  size="small"
                />
                <IconButton
                  color="primary"
                  type="submit"
                  disabled={!newMessage.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          </>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography>Wähle einen Chat-Partner aus</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
} 