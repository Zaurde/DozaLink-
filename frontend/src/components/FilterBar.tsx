import { Box, TextField, MenuItem, InputAdornment } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

const categories = [
  { value: '', label: 'Alle Kategorien' },
  { value: 'Auto', label: 'Auto' },
  { value: 'Elektronik', label: 'Elektronik' },
  { value: 'Mode & Beauty', label: 'Mode & Beauty' },
  // ...weitere Kategorien
];

export interface FilterBarProps {
  category: string;
  location: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const FilterBar = ({
  category,
  location,
  search,
  onCategoryChange,
  onLocationChange,
  onSearchChange,
}: FilterBarProps) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      alignItems: 'center',
      maxWidth: 1200,
      mx: 'auto',
      my: 2,
      px: 2,
    }}
  >
    <TextField
      select
      label="Kategorie"
      value={category}
      onChange={e => onCategoryChange(e.target.value)}
      sx={{ minWidth: 160 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CategoryIcon />
          </InputAdornment>
        ),
      }}
    >
      {categories.map(cat => (
        <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
      ))}
    </TextField>
    <TextField
      label="Standort"
      value={location}
      onChange={e => onLocationChange(e.target.value)}
      sx={{ minWidth: 160 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnIcon />
          </InputAdornment>
        ),
      }}
    />
    <TextField
      label="Was suchst du?"
      value={search}
      onChange={e => onSearchChange(e.target.value)}
      sx={{ flex: 1, minWidth: 200 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  </Box>
); 