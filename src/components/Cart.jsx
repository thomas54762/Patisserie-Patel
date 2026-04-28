import { useState } from 'react'
import {
  Paper, Typography, List, ListItem, Box,
  IconButton, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Button, Alert, Link,
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { getAvailableDeliveryDates, formatDate, formatDateISO } from '../utils/deliveryDates'
import { ZohoCreatorService } from '../services/zohoCreator'

export function Cart({ items, organisatie, organisatieId, onUpdateQuantity, onRemove, onOrderSuccess }) {
  const [deliveryDate, setDeliveryDate] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState(null)

  const cutoffHours = Number(organisatie?.Cutoff_tijd_in_uren ?? 24)
  const dates = getAvailableDeliveryDates(cutoffHours)

  async function handleOrder() {
    if (!agreed || !deliveryDate || items.length === 0) return
    setOrdering(true)
    setError(null)
    try {
      const producten = items.map((i) => ({ ID: i.product.ID, Naam: i.product.Naam, quantity: i.quantity }))
      await ZohoCreatorService.createOrder({ organisatieId, producten, orderDate: new Date().toISOString() })
      onOrderSuccess()
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setOrdering(false)
    }
  }

  if (items.length === 0) return null

  return (
    <Paper
      component="section"
      aria-label="Winkelmandje"
      elevation={0}
      sx={{ borderRadius: '24px 24px 0 0', p: 3, mt: 3, boxShadow: '0 -4px 20px rgba(73,16,48,0.08)' }}
    >
      <Typography variant="h4" sx={{ fontSize: 22, mb: 2.5 }}>Jouw bestelling</Typography>

      <List disablePadding sx={{ mb: 3 }}>
        {items.map(({ product, quantity }) => (
          <ListItem
            key={product.ID}
            disablePadding
            sx={{ pb: 1.5, mb: 1.5, borderBottom: 1, borderColor: 'background.default', alignItems: 'center', gap: 1.5 }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.Naam}
              </Typography>
              <Typography variant="caption" color="primary">{product.Qty_per_doos} per doos</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <IconButton size="small" onClick={() => onUpdateQuantity(product.ID, quantity - 1)} aria-label="Minder" sx={{ bgcolor: 'background.default', width: 32, height: 32 }}>
                <RemoveIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 500 }}>{quantity}</Typography>
              <IconButton size="small" onClick={() => onUpdateQuantity(product.ID, quantity + 1)} aria-label="Meer" sx={{ bgcolor: 'background.default', width: 32, height: 32 }}>
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" onClick={() => onRemove(product.ID)} aria-label={`Verwijder ${product.Naam}`} sx={{ color: 'secondary.main', ml: 0.5 }}>
                <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      <FormControl fullWidth sx={{ mb: 2.5 }}>
        <InputLabel>Bezorgdatum</InputLabel>
        <Select label="Bezorgdatum" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}>
          {dates.map((d) => (
            <MenuItem key={formatDateISO(d)} value={formatDateISO(d)}>{formatDate(d)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        sx={{ mb: 2.5, alignItems: 'flex-start' }}
        control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} color="primary" sx={{ pt: 0.25 }} />}
        label={
          <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.5 }}>
            Ik ga akkoord met de{' '}
            <Link href="https://www.bullnice.tech" target="_blank" rel="noopener noreferrer">algemene voorwaarden</Link>
            {' '}en het{' '}
            <Link href="https://www.bullnice.tech/privacy" target="_blank" rel="noopener noreferrer">privacybeleid</Link>
          </Typography>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>{error}</Alert>}

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleOrder}
        disabled={!agreed || !deliveryDate || ordering}
        aria-busy={ordering}
      >
        {ordering ? 'Bestelling verwerken…' : 'Bestellen'}
      </Button>
    </Paper>
  )
}
