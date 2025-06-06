import { Box, Typography, Paper, Stack, Popover, List, ListItemButton, ListItemText } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import BuildIcon from '@mui/icons-material/Build';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const categories = [
  {
    name: 'Auto',
    icon: (
      <img
        src="/images/categories/bmw_156x90_enhanced.png"
        alt="Auto"
        style={{
          width: 78,
          height: 45,
          maxWidth: 78,
          maxHeight: 45,
          objectFit: 'contain',
          display: 'block',
          transition: 'transform 0.18s',
        }}
        className="category-image-icon"
      />
    ),
    color: '#e8f5e9',
    subcategories: [
      { name: 'PKW' },
      { name: 'Motorräder' },
      { name: 'LKW & Nutzfahrzeuge' },
      { name: 'Wohnmobile' }
    ]
  },
  {
    name: 'Elektronik',
    icon: (
      <img
        src="/images/categories/iphone_electronics_icon.png"
        alt="Elektronik"
        style={{
          width: 156,
          height: 90,
          maxWidth: 156,
          maxHeight: 90,
          objectFit: 'contain',
          borderRadius: 12,
          background: '#f8f8f8',
          margin: 'auto',
          display: 'block',
          transition: 'transform 0.18s',
        }}
        className="category-image-icon"
      />
    ),
    color: '#e3f2fd',
    subcategories: [
      { name: 'Handys' },
      { name: 'Computer' },
      { name: 'TV & Audio' }
    ]
  },
  {
    name: 'Haus & Garten',
    icon: <HomeIcon fontSize="large" style={{ color: '#ff9800' }} />, // orange
    color: '#fff3e0',
    subcategories: [
      { name: 'Möbel' },
      { name: 'Garten' },
      { name: 'Werkzeuge' }
    ]
  },
  {
    name: 'Mode & Beauty',
    icon: <CheckroomIcon fontSize="large" style={{ color: '#e91e63' }} />, // pink
    color: '#fce4ec',
    subcategories: [
      { name: 'Damenmode' },
      { name: 'Herrenmode' },
      { name: 'Kosmetik' }
    ]
  },
  {
    name: 'Familie, Kind & Baby',
    icon: <ChildCareIcon fontSize="large" style={{ color: '#8bc34a' }} />, // hellgrün
    color: '#f1f8e9',
    subcategories: [
      { name: 'Kinderwagen' },
      { name: 'Spielzeug' },
      { name: 'Babykleidung' }
    ]
  },
  {
    name: 'Haustiere',
    icon: <PetsIcon fontSize="large" style={{ color: '#795548' }} />, // braun
    color: '#efebe9',
    subcategories: [
      { name: 'Hunde' },
      { name: 'Katzen' },
      { name: 'Kleintiere' }
    ]
  },
  {
    name: 'Heimwerken',
    icon: <BuildIcon fontSize="large" style={{ color: '#607d8b' }} />, // grau
    color: '#eceff1',
    subcategories: [
      { name: 'Werkzeuge' },
      { name: 'Baumaterial' },
      { name: 'Sanitär' }
    ]
  },
  {
    name: 'Weitere Kategorien',
    icon: <MoreHorizIcon fontSize="large" style={{ color: '#9e9e9e' }} />, // grau
    color: '#f5f5f5',
    subcategories: [
      { name: 'Sonstiges' }
    ]
  },
];

interface CategoriesGridProps {
  activeCategory?: string;
  onCategorySelect?: (cat: string, subcat?: string) => void;
}

export const CategoriesGrid = ({ activeCategory, onCategorySelect }: CategoriesGridProps) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1, px: 1, justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Kategorien
        </Typography>
      </Stack>
      <Box
        sx={{
          display: { xs: 'flex', md: 'grid' },
          gridTemplateColumns: { md: 'repeat(6, 1fr)' },
          gap: 2,
          px: 1,
          alignItems: 'center',
          justifyItems: 'center',
          overflowX: { xs: 'auto', md: 'unset' },
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: 4 },
        }}
      >
        {categories.map((cat, idx) => (
          <Box
            key={cat.name}
            sx={{
              flex: { xs: '0 0 96px', md: 'unset' },
              minWidth: { xs: 96, md: 0 },
              maxWidth: { xs: 96, md: 220 },
              mx: { xs: 0.5, md: 0 },
              my: { xs: 0, md: 0 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper
              onClick={() => onCategorySelect ? onCategorySelect(cat.name) : navigate(`/category/${cat.name}`)}
              sx={{
                bgcolor: activeCategory === cat.name ? '#e0e7ef' : '#F1F5F9',
                border: activeCategory === cat.name ? '2px solid #2563EB' : '2px solid transparent',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'background 0.18s, border 0.18s',
                mb: 1,
                '&:hover': {
                  bgcolor: '#e2e8f0',
                },
                '&:hover .category-image-icon': {
                  transform: 'scale(1.05)',
                },
              }}
              elevation={0}
            >
              {cat.icon}
            </Paper>
            <Typography variant="body2" align="center" sx={{ fontWeight: 500, fontSize: 14, color: 'text.primary', mt: 0.5 }}>
              {cat.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}; 