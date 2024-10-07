import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#000000',  // Primary color for buttons (black in this case)
      dark: '#fdb73e',  // Dark version of your primary color
    },
  },
  components: {
    MuiButton: {        //Buttons
      styleOverrides: {
        root: {
          borderRadius: 20,  
        },
      },
    },
  },
});

export default Theme;
