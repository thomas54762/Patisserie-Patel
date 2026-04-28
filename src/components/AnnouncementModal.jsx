import { forwardRef } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Typography, Button, Slide, Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export function AnnouncementModal({ announcement, onClose }) {
  return (
    <Dialog
      open={!!announcement}
      onClose={onClose}
      TransitionComponent={SlideUp}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { m: 2, mt: 'auto', mb: { xs: 2, sm: 'auto' }, bgcolor: 'background.default' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Chip
          label="Aankondiging"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontFamily: "'Mansalva', cursive", letterSpacing: 0.5 }}
        />
        <IconButton onClick={onClose} aria-label="Sluiten" size="small" sx={{ bgcolor: 'secondary.main' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {announcement?.Naam && (
        <Typography variant="h5" sx={{ px: 3, pb: 1 }}>
          {announcement.Naam}
        </Typography>
      )}

      <DialogContent sx={{ pt: 0 }}>
        <Typography sx={{ lineHeight: 1.6 }}>
          {announcement?.Aankondiging}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="contained" fullWidth size="large" onClick={onClose}>
          Begrepen
        </Button>
      </DialogActions>
    </Dialog>
  )
}
