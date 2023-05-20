import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function Register() {
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    username: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const handleSubmit = (values: { email: string; password: string; name: string; username: string }) => {
    console.log(values);
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
    <Card variant="outlined" sx={{ px: '20px', py: '40px' }}>
      <CardContent>
        <Typography fontSize="40px">Digital Stories</Typography>
        <Typography fontSize="28px">Register</Typography>
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
            id="email"
            label="email"
            variant="standard"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            id="name"
            label="name"
            variant="standard"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
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
          <Button type="submit" variant="outlined" disabled={formik.isSubmitting}>
            Submit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Register;
