import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, Typography, Box, useTheme, useMediaQuery, Grid, IconButton, TextField, InputAdornment, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CategoryCards } from './components/CategoryCards';
import { ListingGridFull } from './components/ListingGridFull';
import { BottomNav } from './components/BottomNav';
import ListingDetail from './components/ListingDetail';
import { FavoritesPage } from './pages/FavoritesPage';
import { CategoryPage } from './pages/CategoryPage';
import { ChatPage } from './pages/ChatPage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingForm } from './components/ListingForm';
import { ListingEditForm } from './components/ListingEditForm';
import { FavoritesProvider } from './components/FavoritesContext';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { CreateListing } from './components/CreateListing';
import { EditListing } from './components/EditListing';
import { SnackbarProvider } from './context/SnackbarContext';
import { theme } from './theme';
import { ElektronikPage } from './pages/ElektronikPage';
import Sidebar from './components/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import AdCard from './components/AdCard';
import { FilterBar } from './components/FilterBar';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import { categoriesConfig } from './config/categoriesConfig';
import TipsGuide from './components/TipsGuide';
import MailIcon from '@mui/icons-material/Mail';
import { galleryItems } from './components/GallerySection';
import { adService } from './services/adService';
import type { Ad } from './services/adService';
import { Section } from './components/Section';

function HomePage() {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('newest');
  const [ads, setAds] = useState<Ad[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  const handleCategorySelect = (cat: string, subcat?: string) => {
    if (cat) {
      if (subcat) {
        navigate(`/category/${cat}/${subcat}`);
      } else {
        navigate(`/category/${cat}`);
      }
    }
    setActiveCategory(cat === activeCategory && !subcat ? '' : cat);
    setActiveSubcategory(subcat || '');
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setPriceMin('');
    setPriceMax('');
    setSort('newest');
    setFilterModalOpen(false);
  };

  useEffect(() => {
    const fetchAds = async () => {
      setLoadingAds(true);
      try {
        const allAds = await adService.getAllAds();
        setAds(allAds);
      } finally {
        setLoadingAds(false);
      }
    };
    fetchAds();
  }, []);

  // Hilfsfunktionen für Bereiche
  const latestAds = [...ads]
    .sort((a, b) => (b.createdAt as any) - (a.createdAt as any))
    .slice(0, 12);
  const latestIds = new Set(latestAds.map(ad => ad.id));
  const recommendedAds = ads.filter(ad => !latestIds.has(ad.id));
  // Zufällig mischen
  for (let i = recommendedAds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [recommendedAds[i], recommendedAds[j]] = [recommendedAds[j], recommendedAds[i]];
  }
  const recommended = recommendedAds.slice(0, 8);

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ width: '100%', mt: 1 }}>
        <Container maxWidth="xl" sx={{ px: 0, py: 0 }}>
          <Box
            sx={{
              display: { xs: 'block', md: 'flex' },
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ flex: 1, minWidth: { xs: 0, md: 340 } }}>
              <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: 2 }}>
                <Section title="Kategorien">
                  <CategoryCards />
                </Section>
                <Section title="Neueste Anzeigen">
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: 2
                  }}>
                    {loadingAds ? (
                      <div>Lade Anzeigen...</div>
                    ) : (
                      latestAds.map((ad, idx) => (
                        <Box key={ad.id ?? idx}>
                          <AdCard {...ad} id={ad.id ?? String(idx)} />
                        </Box>
                      ))
                    )}
                  </Box>
                </Section>
                <Section title="Für dich empfohlen">
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: 2
                  }}>
                    {loadingAds ? (
                      <div>Lade Anzeigen...</div>
                    ) : (
                      recommended.map((ad, idx) => (
                        <Box key={ad.id ?? idx}>
                          <AdCard {...ad} id={ad.id ?? String(idx)} />
                        </Box>
                      ))
                    )}
                  </Box>
                </Section>
              </Box>
            </Box>
            <Box
              sx={{
                width: 320,
                minWidth: 320,
                maxWidth: 320,
                flexShrink: 0,
                position: 'sticky',
                top: { xs: 64, md: 80 },
                alignSelf: 'flex-start',
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Sidebar />
            </Box>
          </Box>
        </Container>
      </Box>
      <ListingGridFull
        category={category}
        search={search}
        location={location}
        priceMin={priceMin}
        priceMax={priceMax}
        sort={sort}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
          <SnackbarProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
                  <Route path="/listing/:id" element={<ListingDetail />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/create-listing" element={<CreateListing />} />
                  <Route path="/edit-listing/:id" element={<EditListing />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/search" element={<ListingGridFull />} />
                  <Route path="/kategorien/elektronik" element={<ElektronikPage />} />
                  <Route path="/kategorien/:slug" element={<CategoryPage />} />
                  <Route path="/kategorien/:slug/:sub" element={<CategoryPage />} />
                  <Route path="/ratgeber" element={<TipsGuide />} />
                  <Route path="/new" element={<ListingForm />} />
                  <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
              </Layout>
              <BottomNav />
            </Router>
          </SnackbarProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
