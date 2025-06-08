import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  createdAt: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  status: 'active' | 'reported' | 'removed';
  userId: string;
  createdAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    activeListings: 0,
    reportedListings: 0,
  });

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!usersResponse.ok) throw new Error('Fehler beim Laden der Benutzer');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Fetch listings
      const listingsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/listings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!listingsResponse.ok) throw new Error('Fehler beim Laden der Anzeigen');
      const listingsData = await listingsResponse.json();
      setListings(listingsData);

      // Calculate stats
      setStats({
        totalUsers: usersData.length,
        activeUsers: usersData.filter((u: User) => u.status === 'active').length,
        totalListings: listingsData.length,
        activeListings: listingsData.filter((l: Listing) => l.status === 'active').length,
        reportedListings: listingsData.filter((l: Listing) => l.status === 'reported').length,
      });
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, 'error');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabValue(value);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole
        })
      });

      if (!response.ok) throw new Error('Fehler beim Aktualisieren des Benutzers');

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setEditDialogOpen(false);
      showSnackbar('Benutzer erfolgreich aktualisiert', 'success');
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: 'active' | 'blocked') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: currentStatus === 'active' ? 'blocked' : 'active'
        })
      });

      if (!response.ok) throw new Error('Fehler beim Ändern des Benutzerstatus');

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      showSnackbar('Benutzerstatus erfolgreich geändert', 'success');
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleToggleListingStatus = async (listingId: string, currentStatus: 'active' | 'reported' | 'removed') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/listings/${listingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: currentStatus === 'active' ? 'removed' : 'active'
        })
      });

      if (!response.ok) throw new Error('Fehler beim Ändern des Anzeigenstatus');

      const updatedListing = await response.json();
      setListings(listings.map(l => l.id === updatedListing.id ? updatedListing : l));
      showSnackbar('Anzeigenstatus erfolgreich geändert', 'success');
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Statistiken */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Benutzer
            </Typography>
            <Typography variant="h5">
              {stats.totalUsers}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {stats.activeUsers} aktiv
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Anzeigen
            </Typography>
            <Typography variant="h5">
              {stats.totalListings}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {stats.activeListings} aktiv
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Gemeldete Anzeigen
            </Typography>
            <Typography variant="h5">
              {stats.reportedListings}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          aria-label="admin tabs"
        >
          <Tab label="Benutzer" />
          <Tab label="Anzeigen" />
        </Tabs>

        {/* Benutzer-Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>E-Mail</TableCell>
                  <TableCell>Rolle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Erstellt am</TableCell>
                  <TableCell>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleToggleUserStatus(user.id, user.status)}
                        color={user.status === 'active' ? 'error' : 'success'}
                      >
                        <BlockIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Anzeigen-Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titel</TableCell>
                  <TableCell>Preis</TableCell>
                  <TableCell>Kategorie</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Erstellt am</TableCell>
                  <TableCell>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>{listing.title}</TableCell>
                    <TableCell>{listing.price}€</TableCell>
                    <TableCell>{listing.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={listing.status}
                        color={
                          listing.status === 'active'
                            ? 'success'
                            : listing.status === 'reported'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleToggleListingStatus(listing.id, listing.status)}
                        color={listing.status === 'active' ? 'error' : 'success'}
                      >
                        {listing.status === 'active' ? <DeleteIcon /> : <EditIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Benutzer bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="E-Mail"
            type="email"
            fullWidth
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Rolle"
            fullWidth
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
            SelectProps={{
              native: true,
            }}
          >
            <option value="user">Benutzer</option>
            <option value="admin">Admin</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSaveUser} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel; 