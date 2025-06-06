import { Box, Typography, Card, CardMedia } from '@mui/material';

export const ImageTextGrid = () => {
  const sections = [
    {
      image: "https://picsum.photos/800/600?random=4",
      title: "Sicherer Kauf & Verkauf",
      description: "Bei uns können Sie sicher und einfach Ihre Artikel kaufen und verkaufen. Unser verifiziertes Bewertungssystem gibt Ihnen die Sicherheit, die Sie brauchen.",
      reverse: false
    },
    {
      image: "https://picsum.photos/800/600?random=5",
      title: "Lokale Angebote",
      description: "Finden Sie die besten Angebote in Ihrer Nähe. Mit unserer Standortsuche entdecken Sie tolle Deals in Ihrer Umgebung.",
      reverse: true
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      {sections.map((section, index) => (
        <Box
          key={index}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: section.reverse ? '1fr 1fr' : '1fr 1fr'
            },
            gap: 4,
            mb: 6,
            '& > *:first-of-type': {
              order: { xs: 1, md: section.reverse ? 2 : 1 }
            },
            '& > *:last-of-type': {
              order: { xs: 2, md: section.reverse ? 1 : 2 }
            }
          }}
        >
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="100%"
              image={section.image}
              alt={section.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            p: { xs: 2, md: 4 }
          }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {section.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}; 