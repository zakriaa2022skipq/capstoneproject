import { Box, Button, ButtonGroup, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  return (
    <Box maxWidth="550px" sx={{ m: '0 auto', textAlign: 'center' }}>
      <Card
        variant="outlined"
        sx={{
          paddingBlock: '10px',
          height: '500px',
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 36 }} color="text.primary">
            Digital Stories
          </Typography>
          <Typography sx={{ fontSize: 22, mt: 8 }} color="text.secondary">
            Join now to share your stories and see what exciting stories others have shared!
          </Typography>
          <ButtonGroup orientation="vertical" sx={{ mt: 8 }}>
            <Button
              onClick={() => {
                navigate('/signin');
              }}
            >
              Already have an account? Signin
            </Button>
            <Button
              onClick={() => {
                navigate('/register');
              }}
            >
              Don&#37;t have an account signup
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Landing;
