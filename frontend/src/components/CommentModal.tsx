import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import { Alert, AlertTitle, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { InfiniteData, QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../utils/axios';

function CommentModal({
  addCommentModal,
  setAddCommentModal,
  storyId,
  refetchAddComment,
  refetchAddCommentArg,
}: {
  addCommentModal: boolean;
  setAddCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  storyId: string;
  refetchAddComment?:
    | (<TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
      ) => Promise<QueryObserverResult<InfiniteData<any>, unknown>>)
    | undefined;
  refetchAddCommentArg?: object;
}) {
  // const handleOpen = () => setAddCommentModal(true);
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
    comment: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Comment cannot exceed 50 char limit. Too Long!')
      .required('Required'),
  });
  const commentMutation = useMutation(
    (commentBody: { text: string }) =>
      axios.put(`api/v1/story/${storyId}/comment`, commentBody, { withCredentials: true }),
    {
      onSuccess: () => {
        if (refetchAddComment && refetchAddCommentArg) {
          refetchAddComment(refetchAddCommentArg);
        } else if (refetchAddComment) {
          refetchAddComment();
        }

        setAddCommentModal(false);
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
  const handleSubmit = async (values: { comment: string }) => {
    commentMutation.mutate({ text: values.comment });
  };

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
            sx={{
              mt: '12px',
              width: 'max-content',
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
            <span>Comment</span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}
CommentModal.defaultProps = {
  refetchAddComment: undefined,
  refetchAddCommentArg: undefined,
};

export default CommentModal;
