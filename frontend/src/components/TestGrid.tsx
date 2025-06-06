import { Box, Typography } from '@mui/material';

export const TestGrid = () => {
  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        md: '1fr 1fr'
      },
      gap: 2,
      p: 2
    }}>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        p: 2, 
        color: 'white',
        borderRadius: 1
      }}>
        <Typography>Grid Item 1</Typography>
      </Box>
      <Box sx={{ 
        bgcolor: 'secondary.main', 
        p: 2, 
        color: 'white',
        borderRadius: 1
      }}>
        <Typography>Grid Item 2</Typography>
      </Box>
    </Box>
  );
}; 