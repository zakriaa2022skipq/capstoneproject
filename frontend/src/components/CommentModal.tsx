import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import axios from 'axios';

function CommentModal({
  addCommentModal,
  setAddCommentModal,
  storyId,
}: {
  addCommentModal: boolean;
  setAddCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  storyId: string;
}) {
  const handleOpen = () => setAddCommentModal(true);
  const handleClose = () => setAddCommentModal(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
  };
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().min(2, 'Too Short!').max(400, 'Too Long!').required('Required'),
  });
  const commentMutation = useMutation((commentBody: { text: string }) =>
    axios.put(`http://localhost:5000/api/v1/story/${storyId}/comment`, commentBody, { withCredentials: true }),
  );
  const handleSubmit = async (values: { comment: string }) => {
    commentMutation.mutate({ text: values.comment });
  };
  useEffect(() => {
    if (commentMutation.isSuccess) {
      setAddCommentModal(false);
    }
  }, [commentMutation.isSuccess, setAddCommentModal]);
  useEffect(() => {
    if (commentMutation.isError) {
      setShowAlert(true);
      if (typeof commentMutation.error === 'object') {
        setErrMessage(commentMutation.error?.response?.data);
      }
    }
  }, [commentMutation.isError, commentMutation.error]);
  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validationSchema: CommentSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      <Modal
        open={addCommentModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={formik.handleSubmit}>
          {commentMutation.isError && showAlert && (
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
          <TextField
            id="comment"
            label="comment"
            variant="standard"
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.comment && formik.errors.comment}
            error={formik.touched.comment && Boolean(formik.errors.comment)}
            multiline
            rows={3}
          />
          <LoadingButton
            loading={commentMutation.isLoading}
            type="submit"
            variant="outlined"
            disabled={formik.isSubmitting}
            sx={{ mt: '12px', width: 'max-content' }}
          >
            <span>Comment</span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}
export default CommentModal;
