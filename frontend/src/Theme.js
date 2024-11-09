import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {      
      main: '#fff',  // Primary color for buttons (black in this case)
      dark: '#00FF00',  // Dark version of your primary color
    },
    secondary: {
      main: '#fdb73e', // Secondary color 00FF00
    },
  },
  components: {
    MuiButton: {       
      styleOverrides: {
        root: {
          borderRadius: 20,  
          textTransform: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(253, 183, 62, 0.2)',  
          },
        },
      },
    },
  },
});

export default Theme;
