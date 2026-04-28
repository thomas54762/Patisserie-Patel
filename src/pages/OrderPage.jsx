import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Typography, CircularProgress } from '@mui/material'
import logo from '../assets/logo.png'
import { useOrganisation } from '../hooks/useOrganisation'
import { useProducts } from '../hooks/useProducts'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { useCart } from '../hooks/useCart'
import { AnnouncementModal } from '../components/AnnouncementModal'
import { ProductTile } from '../components/ProductTile'
import { ProductModal } from '../components/ProductModal'
import { Cart } from '../components/Cart'

const PAGE = { maxWidth: 520, mx: 'auto', width: '100%' }

export function OrderPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const organisatieId = searchParams.get('organisatie_id')

  const { organisation, loading: loadingOrg, error: orgError } = useOrganisation(organisatieId)
  const { products, loading: loadingProducts } = useProducts(organisation)
  const { announcement } = useAnnouncements(organisatieId)
  const { items, addItem, updateQuantity, removeItem, totalItems } = useCart()

  const [announcementDismissed, setAnnouncementDismissed] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const loading = loadingOrg || loadingProducts
  const showAnnouncement = !!announcement && !announcementDismissed

  if (!organisatieId) {
    return <ErrorScreen message="Geen organisatie gevonden. Scan de QR-code opnieuw." />
  }

  if (loading) return <LoadingScreen />

  if (orgError) {
    return <ErrorScreen message="Organisatie niet gevonden. Neem contact op via info@patisseriepastel.nl" />
  }

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ ...PAGE, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box component="header" sx={{ px: 2.5, pt: 2.5 }}>
          <Logo />
        </Box>

        <Box component="main" sx={{ flex: 1, px: 2.5, pt: 2, display: 'flex', flexDirection: 'column' }}>
          {organisation && (
            <Typography sx={{ fontFamily: "'Mansalva', cursive", fontSize: 13, color: '#b49a18', mb: 2, letterSpacing: 0.5 }}>
              {organisation.naam}
            </Typography>
          )}

          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
              <Typography sx={{ mb: 1, lineHeight: 1.6 }}>Er zijn momenteel geen producten beschikbaar.</Typography>
              <Typography sx={{ lineHeight: 1.6 }}>
                Neem contact op via{' '}
                <a href="mailto:info@patisseriepastel.nl" style={{ color: '#9d2f6a' }}>info@patisseriepastel.nl</a>
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {products.map((product) => {
                const cartItem = items.find((i) => i.product.ID === product.ID)
                return (
                  <ProductTile
                    key={product.ID}
                    product={product}
                    cartQuantity={cartItem?.quantity ?? 0}
                    onClick={setSelectedProduct}
                  />
                )
              })}
            </Box>
          )}

          {totalItems > 0 && (
            <Cart
              items={items}
              organisatie={organisation}
              organisatieId={organisatieId}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              onOrderSuccess={() => navigate('/bedankt')}
            />
          )}
        </Box>
      </Box>

      <AnnouncementModal
        announcement={showAnnouncement ? announcement : null}
        onClose={() => setAnnouncementDismissed(true)}
      />
      <ProductModal
        product={selectedProduct}
        onAdd={addItem}
        onClose={() => setSelectedProduct(null)}
      />
    </Box>
  )
}

function Logo() {
  return (
    <Box component="img" src={logo} alt="Pastel" sx={{ height: 56, width: 'auto' }} />
  )
}

function LoadingScreen() {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', ...PAGE }}>
      <CircularProgress color="primary" />
    </Box>
  )
}

function ErrorScreen({ message }) {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, ...PAGE }}>
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
        <Logo />
        <Typography sx={{ lineHeight: 1.6, maxWidth: 280 }}>{message}</Typography>
      </Box>
    </Box>
  )
}
