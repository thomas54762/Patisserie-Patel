import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { OrderPage } from './pages/OrderPage'
import { ThankYouPage } from './pages/ThankYouPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderPage />} />
        <Route path="/bedankt" element={<ThankYouPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
