import { Alert, AlertTitle, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import Files from 'react-files';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import { updateLoginStatus } from '../features/auth/authSlice';
import styles from './creatstory.module.css';

function CreateStory() {
  interface File {
    extension: string;
    id: string;
    preview: { type: string; url?: string };
    name: string;
    size: number;
    type: string;
    sizeReadable: string;
  }
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const dispatch = useDispatch();
  const [mediaFile, setMediaFile] = useState<File | undefined>(undefined);
  const [fileError, setFileError] = useState({ show: false, message: '' });
  const createStorySchema = Yup.object().shape({
    text: Yup.string().max(1000, 'Too Long!'),
  });
  const fileErrorHandler = (error: { message: string }, file) => {
    setFileError({ show: true, message: error.message });
  };
  const navigate = useNavigate();
  const createStoryMutation = useMutation((formData) =>
    axios.post('http://localhost:5000/api/v1/story', formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );
  const handleSubmit = async (values) => {
    const formData = new FormData();
    if (mediaFile === undefined && values.text === '') {
      setShowAlert(true);
      setErrMessage('Empty story cannot be created');
      return;
    }
    if (values.text !== '') {
      formData.append('text', values.text);
    }
    if (mediaFile !== undefined) {
      if (mediaFile.type.match(/^image\/.*/) != null) {
        formData.append('image', new Blob([mediaFile], { type: mediaFile.type }), mediaFile.name || 'file');
      } else {
        formData.append('video', new Blob([mediaFile], { type: mediaFile.type }), mediaFile.name || 'file');
      }
    }
    console.log(formData.get('video'));
    createStoryMutation.mutate(formData);
  };
  const fileChangeHandler = (file: File[]) => {
    if (file !== undefined && file.length !== 0) {
      setMediaFile(file[0]);
      setFileError({ show: false, message: '' });
    } else {
      setMediaFile(undefined);
    }
  };
  useEffect(() => {
    if (createStoryMutation.isSuccess) {
      navigate('/home');
    }
  }, [createStoryMutation.isSuccess, navigate]);

  useEffect(() => {
    if (createStoryMutation.isError) {
      setShowAlert(true);
      if (typeof createStoryMutation.error === 'object') {
        setErrMessage(createStoryMutation.error?.response?.data);
      }
    }
  }, [createStoryMutation.isError, createStoryMutation.error]);
  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema: createStorySchema,
    onSubmit: handleSubmit,
  });
  return (
    <>
      <Navbar />
      <Box sx={{ my: '24px' }}>
        <Card variant="outlined" sx={{ px: '20px', py: '40px', width: '450px', textAlign: 'center', mx: 'auto' }}>
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
            <Typography fontSize="40px">Create Story</Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <TextField
                id="text"
                label="story text"
                variant="standard"
                value={formik.values.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.text && formik.errors.text}
                error={formik.touched.text && Boolean(formik.errors.text)}
                multiline
                minRows={2}
                maxRows={4}
              />
              <Box sx={{ minHeight: '60px', border: '1px solid black', display: 'flex' }}>
                <Files
                  className={styles['files-dropzone']}
                  onChange={fileChangeHandler}
                  onError={fileErrorHandler}
                  accepts={['image/png', 'image/jpeg', 'video/mp4', 'video/JPEG', 'video/AV1', 'video/x-matroska']}
                  multiple={false}
                  maxFileSize={104857600} // 100mb
                  minFileSize={0}
                  maxFiles={1}
                  clickable
                >
                  Drop image/video here or click to upload
                </Files>
              </Box>
              {fileError.show && <Typography sx={{ color: 'red' }}>{fileError.message}</Typography>}
              <Box>
                {mediaFile === undefined ? (
                  ''
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {mediaFile.preview.type === 'image' ? (
                      <img src={mediaFile.preview.url} alt="story" width="100px" height="100px" />
                    ) : (
                      <video src={URL.createObjectURL(mediaFile)} muted width="200px" height="200px" controls />
                    )}
                    <Button
                      onClick={() => {
                        setMediaFile(undefined);
                      }}
                      variant="outlined"
                      sx={{ mt: '12px' }}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>
              <LoadingButton
                loading={createStoryMutation.isLoading}
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
    </>
  );
}
export default CreateStory;
