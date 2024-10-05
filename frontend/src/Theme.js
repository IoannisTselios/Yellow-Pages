import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#000000',  // Primary color for buttons (black in this case)
      dark: '#fdb73e',  // Dark version of your primary color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,  // Global border radius for buttons
        },
      },
    },
  },
});

export default Theme;
