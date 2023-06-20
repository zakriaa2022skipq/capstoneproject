import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import Files from 'react-files';
import { BiUpload } from 'react-icons/bi';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import styles from './register.module.css';
import { MediaFile } from './CreateStory';
import axios from '../utils/axios';

function Register() {
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    password: Yup.string().min(5, 'Too Short!').max(20, 'Too Long!').required('Required'),
    username: Yup.string().min(4, 'Too Short!').max(20, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const [fileError, setFileError] = useState({ show: false, message: '' });

  const [mediaFile, setMediaFile] = useState<MediaFile | undefined>(undefined);

  const registerMutation = useMutation((registerData: FormData) => axios.post('api/v1/user/register', registerData), {
    onSuccess: () => {
      navigate('/signin');
    },
    onError: (error: AxiosError) => {
      setShowAlert(true);
      if (error.response) {
        if (typeof error.response.data === 'string') setErrMessage(error.response.data);
      } else if (error.request) {
        setErrMessage(error.message);
      } else {
        setErrMessage(error.message);
      }
    },
  });

  const fileChangeHandler = (file: File[]) => {
    if (file !== undefined && file.length !== 0) {
      setMediaFile(file[0]);
      setFileError({ show: false, message: '' });
    } else {
      setMediaFile(undefined);
    }
  };

  const fileErrorHandler = (error: { message: string }) => {
    setFileError({ show: true, message: error.message });
  };

  const handleSubmit = (formFields: { email: string; password: string; name: string; username: string }) => {
    const formData = new FormData();
    if (mediaFile !== undefined) {
      formData.append('profilepic', new Blob([mediaFile], { type: mediaFile.type }), mediaFile.name || 'file');
    }
    Object.entries(formFields).forEach(([key, value]) => {
      formData.set(key, value);
    });
    registerMutation.mutate(formData);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      username: '',
      name: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          px: '20px',
          py: '20px',
          width: '450px',
          textAlign: 'center',
          borderColor: 'hsl(180, 27%, 58%)',
          maxWidth: '80vw',
          my: '20px',
        }}
      >
        {' '}
        {showAlert && (
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
          <Typography fontSize="28px" sx={{ color: 'hsl(169, 79%, 37%)', pb: '12px' }}>
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <TextField
                id="username"
                label="username"
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
                data-testid="register-form"
              />
              <TextField
                id="email"
                label="email"
                variant="standard"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  '& .MuiInput-root:before': {
                    borderColor: 'hsl(180, 27%, 58%)',
                  },
                  '& .MuiInput-root:after': { borderColor: 'hsl(180, 35%, 50%)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(169, 75%, 50%)' },
                }}
              />
            </Box>

            <TextField
              id="name"
              label="name"
              variant="standard"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
              label="password"
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
            <Box
              sx={{
                minHeight: '40px',
                border: '1px solid hsl(180, 35%, 50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Files
                className={styles['files-dropzone']}
                onChange={fileChangeHandler}
                onError={fileErrorHandler}
                accepts={['image/png', 'image/jpeg']}
                multiple={false}
                maxFileSize={3145728} // 3mb
                minFileSize={0}
                maxFiles={1}
                clickable
                id="profilepic"
              >
                Profile Picture
                <BiUpload style={{ marginLeft: '12px' }} />
              </Files>
            </Box>
            {fileError.show && <Typography sx={{ color: 'red' }}>{fileError.message}</Typography>}
            <Box>
              {mediaFile === undefined ? (
                ''
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={mediaFile?.preview?.url} alt="story" width="70px" height="70px" />
                  <Button
                    onClick={() => {
                      setMediaFile(undefined);
                    }}
                    variant="outlined"
                    sx={{
                      color: 'rgba(0, 0, 0, 0.6)',
                      borderColor: 'hsl(180, 27%, 58%)',
                      ':hover': {
                        borderColor: 'hsl(180, 27%, 58%)',
                        backgroundColor: 'tranparent',
                      },
                      mt: '12px',
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
            <LoadingButton
              loading={registerMutation.isLoading}
              disabled={registerMutation.isLoading}
              type="submit"
              variant="outlined"
              sx={{
                color: 'hsl(169, 75%, 50%)',
                borderColor: 'hsl(169, 79%, 48%)',
                ':hover': {
                  borderColor: 'hsl(169, 79%, 48%)',
                  backgroundColor: 'tranparent',
                },
              }}
            >
              Submit
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
