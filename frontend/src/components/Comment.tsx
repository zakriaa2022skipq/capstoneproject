import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Typography } from '@mui/material';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { InfiniteData, QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import axios from '../utils/axios';

export interface StoryComment {
  _id: string;
  storyId: string;
  text: string;
  createdAt: string;
  author: {
    username: string;
    profilepic: string;
  };
  isCommentAuthor: boolean;
}
interface Props {
  comment: StoryComment;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<InfiniteData<StoryComment[]>, unknown>>;
}

function Comment({ comment, refetch }: Props) {
  const commentDate = new Date(comment.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const deleteMutation = useMutation(
    () =>
      axios({
        url: `api/v1/story/${comment.storyId}/comment/${comment._id}`,
        method: 'Delete',
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        if (refetch) {
          refetch();
        }
      },
    },
  );
  return (
    <Box sx={{ borderBottom: '1px solid black', mb: '8px', p: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '8px' }}>
        <Avatar
          sx={{ width: '30px', height: '30px' }}
          src={
            comment.author.profilepic &&
            `${process.env.environment === 'development' ? process.env.SERVER_URL : ''}/public/profile/${
              comment.author.profilepic
            }`
          }
        />
        <Typography sx={{ fontSize: '16px' }}>{comment.author.username}</Typography>
        <Typography sx={{ fontSize: '9px' }}>{commentDate}</Typography>
      </Box>

      <Typography sx={{ fontSize: '12px', textAlign: 'justify' }}>{comment.text}</Typography>
      {comment.isCommentAuthor && (
        <LoadingButton
          onClick={() => {
            deleteMutation.mutate();
          }}
          loading={deleteMutation.isLoading}
          type="button"
          variant="text"
          sx={{
            display: 'flex',
            alignItems: 'center',
            pa: 0,
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
          <span>Delete</span>
          <MdOutlineDeleteSweep size="18px" color="red" title="Delete Comment" style={{ marginLeft: '8px' }} />
        </LoadingButton>
      )}
    </Box>
  );
}
export default Comment;
