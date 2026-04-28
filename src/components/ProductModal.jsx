import { useState, forwardRef } from 'react'
import {
  Dialog, DialogTitle, DialogContent,
  IconButton, Typography, Box, Button, Slide,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export function ProductModal({ product, onAdd, onClose }) {
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    onAdd(product, quantity)
    onClose()
  }

  return (
    <Dialog
      open={!!product}
      onClose={onClose}
      TransitionComponent={SlideUp}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { m: 2, mt: 'auto', mb: { xs: 2, sm: 'auto' } } }}
    >
      <DialogTitle sx={{ pr: 7, pb: 0 }}>
        <Typography variant="h4" component="span" sx={{ fontSize: 26 }}>
          {product?.Naam}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Sluiten"
          size="small"
          sx={{ position: 'absolute', right: 16, top: 16, bgcolor: 'background.default' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        {product?.Omschrijving && (
          <Typography sx={{ mb: 1.5, opacity: 0.8, lineHeight: 1.6 }}>
            {product.Omschrijving}
          </Typography>
        )}
        <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 3.5 }}>
          {product?.Qty_per_doos} per doos
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderRadius: 9999 }}>
            <IconButton
              size="small"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Minder"
              sx={{ width: 40, height: 40 }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography aria-live="polite" sx={{ minWidth: 32, textAlign: 'center', fontWeight: 500 }}>
              {quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Meer"
              sx={{ width: 40, height: 40 }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <Button variant="contained" onClick={handleAdd} sx={{ px: 3 }}>
            Toevoegen
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
