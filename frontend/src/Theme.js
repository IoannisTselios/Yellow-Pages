import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#000000',  // Primary color for buttons (black in this case)
      dark: '#fdb73e',  // Dark version of your primary color
    },
    secondary: {
      main: '#fdb73e', // Secondary color 
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
            backgroundColor: 'rgba(253, 183, 62, 0.2)',  // Default color with 0.04 transparency
          },
        },
      },
    },
  },
});

export default Theme;
