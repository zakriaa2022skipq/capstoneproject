import { Avatar, Box, Stack, Typography } from '@mui/material';

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
}

function Comment({ comment }: Props) {
  const commentDate = new Date(comment.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <Box sx={{ borderBottom: '1px solid black', mb: '8px', p: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '8px' }}>
        <Avatar
          sx={{ width: '30px', height: '30px' }}
          src={comment.author.profilepic && `http://localhost:5000/public/profile/${comment.author.profilepic}`}
        />
        <Typography sx={{ fontSize: '16px' }}>{comment.author.username}</Typography>
        <Typography sx={{ fontSize: '9px' }}>{commentDate}</Typography>
      </Box>

      <Typography sx={{ fontSize: '12px' }}>{comment.text}</Typography>
    </Box>
  );
}
export default Comment;
