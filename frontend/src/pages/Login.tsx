import { Alert, AlertTitle, Box, Card, CardContent, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateLoginStatus } from '../features/auth/authSlice';

function Login() {
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const dispatch = useDispatch();
  const SigninSchema = Yup.object().shape({
    password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    username: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Required'),
  });

  const navigate = useNavigate();
  const loginMutation = useMutation((loginData: { password: string; username: string }) =>
    axios.post('http://localhost:5000/api/v1/auth/login', loginData, { withCredentials: true }),
  );
  const handleSubmit = async (values: { password: string; username: string }) => {
    loginMutation.mutate(values);
  };
  useEffect(() => {
    if (loginMutation.isSuccess) {
      dispatch(updateLoginStatus(true));
      navigate('/home');
    }
  }, [loginMutation.isSuccess, navigate, dispatch]);

  useEffect(() => {
    if (loginMutation.isError) {
      setShowAlert(true);
      if (typeof loginMutation.error === 'object') {
        setErrMessage(loginMutation.error?.response?.data);
      }
    }
  }, [loginMutation.isError, loginMutation.error]);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: SigninSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ px: '20px', py: '40px', width: '450px', textAlign: 'center' }}>
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
          <Typography fontSize="40px">Digital Stories</Typography>
          <Typography fontSize="28px">Signin</Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <TextField
              id="username"
              label="username"
              variant="standard"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.username && formik.errors.username}
              error={formik.touched.username && Boolean(formik.errors.username)}
            />
            <TextField
              id="password"
              label="password"
              variant="standard"
              type="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <LoadingButton
              loading={loginMutation.isLoading}
              type="submit"
              variant="outlined"
              disabled={formik.isSubmitting}
            >
              <span> Submit</span>
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
