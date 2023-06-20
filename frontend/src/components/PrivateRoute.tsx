import { Box, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '../app/store';
import { updateLoginStatus } from '../features/auth/authSlice';
import { updateUserState } from '../features/user/userSlice';
import axios from '../utils/axios';

function PrivateRoutes() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const getUserDetail = () => axios.get('api/v1/auth/me', { withCredentials: true }).then((response) => response.data);
  const query = useQuery('userDetail', getUserDetail, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    retry: false,
    onSuccess: (data) => {
      dispatch(updateLoginStatus(true));
      dispatch(updateUserState(data.userDetail));
    },
  });

  if (query.isLoading) {
    return (
      <Box
        sx={{
          color: 'hsl(180, 43%, 41%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          my: '16px',
        }}
        data-testid="loading"
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }
  return isLoggedIn ? <Outlet /> : <Navigate to="/signin" replace state={{ path: location.pathname }} />;
}
export default PrivateRoutes;
