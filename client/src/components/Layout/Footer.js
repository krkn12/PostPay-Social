import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Email,
  Favorite
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}15 0%, 
          ${theme.palette.secondary.main}10 100%)`,
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
        py: { xs: 3, md: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 3, md: 4 }
          }}
        >
          {/* Informações do Projeto */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              PostPay Social
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ maxWidth: 300, lineHeight: 1.6 }}
            >
              Plataforma de pesquisas remuneradas que conecta empresas e usuários 
              de forma inteligente e transparente.
            </Typography>
          </Box>

          {/* Links Rápidos */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
            >
              Links Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="/about" 
                color="text.secondary" 
                underline="hover"
                sx={{ 
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Sobre o Projeto
              </Link>
              <Link 
                href="/privacy" 
                color="text.secondary" 
                underline="hover"
                sx={{ 
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Política de Privacidade
              </Link>
              <Link 
                href="/terms" 
                color="text.secondary" 
                underline="hover"
                sx={{ 
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Termos de Uso
              </Link>
            </Box>
          </Box>

          {/* Redes Sociais */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
            >
              Conecte-se
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <IconButton
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}25`
                  }
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#0077B5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px #0077B525'
                  }
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                href="mailto:contato@postpaysocial.com"
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${theme.palette.secondary.main}25`
                  }
                }}
              >
                <Email />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, opacity: 0.3 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            © {currentYear} PostPay Social. Todos os direitos reservados.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">
              Feito com
            </Typography>
            <Favorite 
              sx={{ 
                fontSize: 16, 
                color: 'error.main',
                animation: 'heartbeat 1.5s ease-in-out infinite'
              }} 
            />
            <Typography variant="body2">
              por um desenvolvedor júnior
            </Typography>
          </Box>
        </Box>
      </Container>
      
      {/* Animação CSS */}
      <style>
        {`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
};

export default Footer;