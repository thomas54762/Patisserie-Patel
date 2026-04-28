import { Box, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import logo from '../assets/logo.png'

export function ThankYouPage() {
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 340 }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <CheckIcon sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Typography variant="h3" sx={{ fontSize: 30, color: 'white' }}>
          Bedankt voor uw bestelling!
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
          Uw bestelling is ontvangen en wordt zo snel mogelijk verwerkt.
        </Typography>
        <Typography sx={{ fontFamily: "'Mansalva', cursive", fontSize: 14, color: '#e5af9f', mt: 1 }}>
          Zet je desserts weer op de kaart.
        </Typography>
        <Box component="img" src={logo} alt="Pastel" sx={{ height: 72, width: 'auto', mt: 1 }} />
      </Box>
    </Box>
  )
}
