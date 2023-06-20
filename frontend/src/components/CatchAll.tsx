import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function CatchAll() {
  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography>The page you are trying to access does not exist</Typography>
      <Link to="/home" style={{ textDecoration: 'none' }}>
        Go to Home page
      </Link>
    </Box>
  );
}
export default CatchAll;
