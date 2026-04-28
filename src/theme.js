import { createTheme } from '@mui/material/styles'

const RASPBERRY = '#9d2f6a'
const TERRA_PEACH = '#e5af9f'
const PLUM = '#491030'
const VANILLA = '#efe8d1'

export const theme = createTheme({
  palette: {
    primary: { main: RASPBERRY, contrastText: '#fff' },
    secondary: { main: TERRA_PEACH, contrastText: PLUM },
    background: { default: VANILLA, paper: '#fff' },
    text: { primary: PLUM },
    error: { main: RASPBERRY },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    h1: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 },
    h2: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 },
    h3: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 },
    h4: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 },
    h5: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 },
    h6: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 },
    body1: { fontWeight: 300 },
    body2: { fontWeight: 300 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { fontWeight: 300, backgroundColor: VANILLA },
        '#root': { minHeight: '100dvh', display: 'flex', flexDirection: 'column' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 9999,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 500,
        },
        sizeLarge: { padding: '14px 24px', fontSize: 16 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 24 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'Outfit', sans-serif" },
      },
    },
  },
})
