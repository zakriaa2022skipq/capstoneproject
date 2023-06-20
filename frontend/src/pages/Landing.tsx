import { Box, Button, ButtonGroup, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '550px',
        maxWidth: '80vw',
        textAlign: 'center',
        mx: 'auto',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          paddingBlock: '10px',
          height: '500px',
          borderColor: 'hsl(180, 27%, 58%)',
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 36, color: 'hsl(169, 79%, 48%)' }}>Digital Stories</Typography>
          <Typography sx={{ fontSize: 22, mt: 8, color: 'hsl(169, 79%, 37%)' }}>
            Join now to share your stories and see what exciting stories others have shared!
          </Typography>
          <ButtonGroup orientation="vertical" sx={{ mt: 8 }}>
            <Button
              onClick={() => {
                navigate('/signin');
              }}
              sx={{
                color: 'hsl(169, 79%, 37%)',
                borderColor: 'hsl(180, 27%, 58%)',
                ':hover': {
                  borderColor: 'hsl(169, 79%, 48%)',
                  backgroundColor: 'tranparent',
                },
              }}
            >
              Already have an account? Signin
            </Button>
            <Button
              sx={{
                color: 'hsl(169, 79%, 37%)',
                borderColor: 'hsl(180, 27%, 58%)',
                ':hover': {
                  borderColor: 'hsl(169, 79%, 48%)',
                  backgroundColor: 'tranparent',
                },
              }}
              onClick={() => {
                navigate('/register');
              }}
            >
              {`Don't have an account? Signup`}
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Landing;
