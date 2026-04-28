import { Card, CardActionArea, Typography, Box } from '@mui/material'

export function ProductTile({ product, cartQuantity, onClick }) {
  return (
    <Card
      sx={{
        position: 'relative',
        border: '2px solid transparent',
        transition: '0.2s ease',
        '@media (hover: hover)': {
          '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-2px)' },
        },
        '&:active': { transform: 'scale(0.97)' },
      }}
    >
      <CardActionArea
        onClick={() => onClick(product)}
        aria-label={`Bekijk ${product.Naam}`}
        sx={{ p: 2.5, minHeight: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.75 }}
      >
        {cartQuantity > 0 && (
          <Box sx={{
            position: 'absolute', top: 10, right: 10,
            bgcolor: 'primary.main', color: 'white',
            borderRadius: '50%', width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, lineHeight: 1,
          }}>
            {cartQuantity}
          </Box>
        )}
        <Typography variant="h6" sx={{ fontSize: 18, lineHeight: 1.2, pr: cartQuantity > 0 ? 3.5 : 0 }}>
          {product.Naam}
        </Typography>
        <Typography variant="caption" color="primary">
          {product.Qty_per_doos} per doos
        </Typography>
      </CardActionArea>
    </Card>
  )
}
