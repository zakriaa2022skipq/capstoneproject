import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import Files from 'react-files';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';
import styles from './creatstory.module.css';

export interface MediaFile extends File {
  extension?: string;
  id?: string;
  preview?: { type: string; url?: string };
  name: string;
  size: number;
  type: string;
  sizeReadable?: string;
}

function CreateStory() {
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [styleChoice, setStyleChoice] = useState('default');
  const [mediaFile, setMediaFile] = useState<MediaFile | undefined>(undefined);
  const [fileError, setFileError] = useState({ show: false, message: '' });
  const createStorySchema = Yup.object().shape({
    text: Yup.string().required('Story text is required').max(350, 'Too Long!'),
    color: Yup.string(),
  });
  const fileErrorHandler = (error: { message: string }) => {
    setFileError({ show: true, message: error.message });
  };
  const navigate = useNavigate();
  const createStoryMutation = useMutation(
    (formData: FormData) =>
      axios.post('api/v1/story', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    {
      onSuccess: () => {
        navigate('/stories/me');
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
    },
  );
  const handleSubmit = async (values: { text: string; color: string }) => {
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
    if (styleChoice === 'color') {
      formData.append('color', values.color);
    }
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

  const formik = useFormik({
    initialValues: {
      text: '',
      color: '#f1f3f4',
    },
    validationSchema: createStorySchema,
    onSubmit: handleSubmit,
  });
  return (
    <Box sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100%' }}>
      <Navbar />
      <Box sx={{ display: 'flex', alignItems: 'center', my: '12px' }}>
        <Card
          variant="outlined"
          sx={{
            px: '20px',
            py: '40px',
            width: '450px',
            textAlign: 'center',
            mx: 'auto',
            borderColor: 'hsl(180, 27%, 58%)',
            maxWidth: '80vw',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: '0',
              backgroundColor: styleChoice === 'color' ? formik.values.color : '',
              opacity: (styleChoice === 'color') !== null ? '0.4' : '0',
              pointerEvents: 'none',
            }}
          />
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
              Create Story
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              data-testid="create-story-form"
            >
              <TextField
                id="text"
                label="Story text"
                variant="standard"
                value={formik.values.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.text && formik.errors.text}
                error={formik.touched.text && Boolean(formik.errors.text)}
                multiline
                minRows={2}
                maxRows={4}
                sx={{
                  '& .MuiInput-root:before': {
                    borderColor: 'hsl(180, 27%, 58%)',
                  },
                  '& .MuiInput-root:after': { borderColor: 'hsl(180, 35%, 50%)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(169, 75%, 50%)' },
                  '&  .MuiInput-input': {
                    color: 'hsl(180, 92%, 19%)',
                    mixBlendMode: styleChoice === 'color' ? 'difference' : '',
                  },
                }}
              />
              <Box sx={{ minHeight: '60px', border: '1px solid hsl(180, 35%, 50%)', display: 'flex' }}>
                <Files
                  className={styles['files-dropzone']}
                  onChange={fileChangeHandler}
                  onError={fileErrorHandler}
                  accepts={['image/png', 'image/jpeg', 'video/mp4', 'video/JPEG', 'video/AV1', 'video/x-matroska']}
                  multiple={false}
                  maxFileSize={5000000} // 5mb
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
                    {mediaFile?.preview?.type === 'image' ? (
                      <img src={mediaFile?.preview?.url} alt="story" width="100px" height="100px" />
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
              <FormControl>
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  sx={{ textAlign: 'start', '&.Mui-focused': { color: 'hsl(169, 75%, 50%)' } }}
                >
                  Story Color
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={styleChoice}
                  onChange={(e) => {
                    setStyleChoice(e.target.value);
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel value="color" control={<Radio size="small" />} label="Color" />
                      <input
                        type="color"
                        name="color"
                        id="color"
                        value={formik.values.color}
                        onChange={formik.handleChange}
                        style={{ width: '30px', height: '30px' }}
                        data-testid="color-input"
                      />
                    </Box>
                    <FormControlLabel value="default" control={<Radio size="small" />} label="default" />
                  </Box>
                </RadioGroup>
              </FormControl>

              <LoadingButton
                loading={createStoryMutation.isLoading}
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
                  mixBlendMode: styleChoice === 'color' ? 'difference' : '',
                  '& .MuiLoadingButton-loadingIndicator': {
                    color: 'hsl(169, 79%, 48%)',
                    mixBlendMode: styleChoice === 'color' ? 'difference' : '',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'hsl(169, 79%, 48%)',
                  },
                }}
              >
                <span>Submit</span>
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
export default CreateStory;
