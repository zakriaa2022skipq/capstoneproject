import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, AlertTitle, Box, Card, CardContent, LinearProgress, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { RootState } from '../app/store';
import { updateLoginStatus } from '../features/auth/authSlice';
import axios from '../utils/axios';

function Login() {
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const dispatch = useDispatch();
  const SigninSchema = Yup.object().shape({
    password: Yup.string().min(5, 'Too Short!').max(50, 'Too Long!').required('Required'),
    username: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Required'),
  });

  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const queryClient = useQueryClient();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      navigate(locationState?.path || '/trending');
    }
  }, [isLoggedIn, navigate, locationState]);
  const getUserDetail = () => axios.get('api/v1/auth/me', { withCredentials: true }).then((response) => response.data);
  const query = useQuery('userDetail', getUserDetail, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    retry: false,
  });
  const loginMutation = useMutation(
    (loginData: { password: string; username: string }) =>
      axios.post('api/v1/auth/login', loginData, { withCredentials: true }),
    {
      onSuccess: () => {
        dispatch(updateLoginStatus(true));
        queryClient.invalidateQueries({ queryKey: 'userDetail' });
        navigate(locationState?.path || '/trending');
      },
      onError: (error: AxiosError) => {
        if (error.response) {
          if (typeof error.response.data === 'string') {
            setErrMessage(error.response.data);
          }
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
        setShowAlert(true);
      },
    },
  );
  const handleSubmit = async (values: { password: string; username: string }) => {
    loginMutation.mutate(values);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: SigninSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      {query.isLoading ||
        (query.isFetching && (
          <Box sx={{ color: 'hsl(180, 43%, 41%)', height: '4px', width: '100%', alignSelf: 'flex-start' }}>
            <LinearProgress color="inherit" />
          </Box>
        ))}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f7fcf8',
          flexDirection: 'column',
        }}
      >
        <Card
          variant="outlined"
          sx={{
            px: '20px',
            py: '40px',
            width: '450px',
            textAlign: 'center',
            backgroundColor: 'var(--primary-button)',
            maxWidth: '80vw',
            borderColor: 'hsl(180, 27%, 58%)',
          }}
        >
          {loginMutation.isError && showAlert && (
            <Alert
              sx={{ maxWidth: '100%' }}
              onClose={() => {
                setShowAlert(false);
              }}
              severity="error"
            >
              <AlertTitle>Error</AlertTitle>
              {errMessage}
            </Alert>
          )}
          <CardContent>
            <Typography fontSize="40px" sx={{ color: 'hsl(169, 79%, 48%)' }}>
              Digital Stories
            </Typography>
            <Typography fontSize="28px" sx={{ color: 'hsl(169, 79%, 37%)' }}>
              Signin
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <TextField
                id="username"
                label="Username"
                variant="standard"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.username && formik.errors.username}
                error={formik.touched.username && Boolean(formik.errors.username)}
                sx={{
                  '& .MuiInput-root:before': {
                    borderColor: 'hsl(180, 27%, 58%)',
                  },
                  '& .MuiInput-root:after': { borderColor: 'hsl(180, 35%, 50%)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(169, 75%, 50%)' },
                }}
              />
              <TextField
                id="password"
                label="Password"
                variant="standard"
                type="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  '& .MuiInput-root:before': {
                    borderColor: 'hsl(180, 27%, 58%)',
                  },
                  '& .MuiInput-root:after': { borderColor: 'hsl(180, 35%, 50%)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(169, 75%, 50%)' },
                }}
              />
              <LoadingButton
                loading={loginMutation.isLoading}
                type="submit"
                variant="outlined"
                disabled={formik.isSubmitting}
                sx={{
                  color: 'hsl(169, 75%, 50%)',
                  borderColor: 'hsl(169, 79%, 48%)',
                  ':hover': {
                    borderColor: 'hsl(169, 79%, 48%)',
                    backgroundColor: 'tranparent',
                  },
                  '.MuiLoadingButton-loadingIndicator': {
                    color: 'hsl(169, 79%, 48%)',
                  },
                }}
              >
                <span>Submit</span>
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default Login;
