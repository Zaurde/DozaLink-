import React from 'react';
import { Box, Card, Typography, Link, Chip, Stack, Drawer, IconButton, useTheme, useMediaQuery, CardContent, Button } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CloseIcon from '@mui/icons-material/Close';
import TipsGuide from './TipsGuide';

interface SidebarCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText?: string;
  link?: string;
  tags?: string[];
}

const SidebarCard = ({ icon, title, description, linkText, link, tags }: SidebarCardProps) => (
  <Card
    sx={{
      p: 2,
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}
  >
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ color: 'primary.main', fontSize: 24 }}>{icon}</Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        {link && linkText && (
          <Link
            href={link}
            underline="hover"
            sx={{
              color: 'primary.main',
              fontSize: 14,
              fontWeight: 500,
              display: 'inline-block',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            {linkText}
          </Link>
        )}
        {tags && (
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: 'background.default',
                  color: 'text.secondary',
                  fontSize: 12,
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  </Card>
);

const SidebarContent = () => {
  const [showTips, setShowTips] = React.useState(false);

  return (
    <Stack spacing={2}>
      <SidebarCard
        icon={<VerifiedUserIcon />}
        title="Verifizierte Profile"
        description="Nur geprüfte Nutzer mit Telefonnummer oder E-Mail."
        linkText="Wie funktioniert das?"
        link="/hilfe/verifizierung"
      />
      <SidebarCard
        icon={<FavoriteIcon />}
        title="Merkliste & Benachrichtigungen"
        description="Speichere Anzeigen und erhalte Preisupdates."
        linkText="Zur Merkliste"
        link="/merkliste"
      />
      <SidebarCard
        icon={<LocationOnIcon />}
        title="Regionale Filter"
        description="Nur Anzeigen aus deiner Region anzeigen."
        linkText="Standort einstellen"
        link="/region"
      />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tipps für Käufer & Verkäufer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            So erkennst du seriöse Angebote & schreibst erfolgreiche Inserate.
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            href="/ratgeber"
            sx={{ mt: 1 }}
          >
            Zum Ratgeber
          </Button>
        </CardContent>
      </Card>
      <SidebarCard
        icon={<CategoryIcon />}
        title="Beliebte Kategorien"
        description="Schnelleinstieg zu den meistgenutzten Bereichen."
        tags={["Sport", "Drogerie", "Technik", "Jobs"]}
      />
      <SidebarCard
        icon={<VolunteerActivismIcon />}
        title="#IchHelfe"
        description="Kostenlose Angebote, Spenden und Nachbarschaftshilfe."
        linkText="Mitmachen"
        link="/hilfe"
      />
    </Stack>
  );
};

interface SidebarProps {
  onClose?: () => void;
  open?: boolean;
}

const Sidebar = ({ onClose, open }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 320,
            p: 2,
            bgcolor: 'background.default',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <SidebarContent />
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: 320,
        position: 'sticky',
        top: 24,
        ml: 3,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <SidebarContent />
    </Box>
  );
};

export default Sidebar; 