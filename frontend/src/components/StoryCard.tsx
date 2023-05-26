import { useState, forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { Box, Button, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MdPublic } from 'react-icons/md';
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { InfiniteData, QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutationResult } from 'react-query';
import { AxiosResponse } from 'axios';
import CommentModal from './CommentModal';

export interface Story {
  author: {
    username: string;
    profilepic: string;
  };
  text?: string;
  image?: string;
  video?: string;
  createdAt: string;
  upvoteCount: number;
  downvoteCount: number;
  isPublic?: boolean;
  _id: string;
}

interface Props {
  story: Story;
  viewCommentOption: boolean;
  viewEditOption?: boolean;
  upvoteStory?: UseMutationResult<AxiosResponse<any, any>, unknown, void, unknown>;
  downvoteStory?: UseMutationResult<AxiosResponse<any, any>, unknown, void, unknown>;
  pageIndex?: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<InfiniteData<any>, unknown>>;
}

const StoryCard = forwardRef(
  ({ story, refetch, pageIndex, viewCommentOption, viewEditOption, upvoteStory, downvoteStory }: Props, ref) => {
    const navigate = useNavigate();
    const storyDate = new Date(story.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const votes = story.upvoteCount - story.downvoteCount;
    const [addCommentModal, setAddCommentModal] = useState(false);
    const handleUpvote = () => {
      upvoteStory?.mutate(story._id);
      // refetch({
      //   refetchPage: (page, index) => {
      //     console.log('here', { pageIndex, page, index });
      //     return index === pageIndex;
      //   },
      // });
      refetch();
    };
    const handleDownvote = () => {
      downvoteStory?.mutate(story._id);
      refetch({ refetchPage: (page, index) => index === pageIndex });
    };
    return (
      <Box ref={ref} sx={{ padding: '12px' }}>
        <Card
          sx={{
            minWidth: 345,
            maxWidth: 350,
            p: '12px',
            mb: '4px',
            border: '1px solid hsl(180, 27%, 58%) ',
            backgroundColor: 'hsl(185, 10%, 95%)',
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                src={`http://localhost:5000/public/profile/${story.author.profilepic}`}
                sx={{ bgcolor: red[500] }}
                aria-label={story.author.username}
              >
                {!story.author.profilepic && story.author.username[0]}
              </Avatar>
            }
            title={story.author.username}
            subheader={`posted on ${storyDate}`}
          />
          {story.image && (
            <CardMedia
              component="img"
              height="194"
              image={`http://localhost:5000/public/story/${story.image}`}
              alt="story"
            />
          )}
          {story.video && (
            <CardMedia
              component="video"
              controls
              src={`http://localhost:5000/public/story/${story.video}`}
              height="194"
            />
          )}
          <CardContent>
            <Typography variant="body2" color="hsl(180, 92%, 19%)" sx={{ textAlign: 'justify' }}>
              {story.text}
            </Typography>
          </CardContent>
          <Divider variant="middle" />
          <CardActions disableSpacing sx={{ mt: '8px', display: 'flex', justifyContent: 'center' }}>
            <IconButton aria-label="upvote" sx={{ p: '4px' }} onClick={handleUpvote}>
              <BiUpvote />
            </IconButton>
            <Typography>{Number.isNaN(votes) ? 0 : votes}</Typography>
            <IconButton onClick={handleDownvote} aria-label="downvote" sx={{ p: '4px' }}>
              <BiDownvote />
            </IconButton>
            <Box sx={{ display: 'flex', gap: '4px' }}>
              <Chip label={`Upvotes:${story.upvoteCount}`} variant="outlined" />
              <Chip label={`Downvotes:${story.downvoteCount}`} variant="outlined" />
              {viewEditOption && story.isPublic && <Chip icon={<MdPublic />} label="Public" variant="outlined" />}
              {viewEditOption && !story.isPublic && (
                <Chip sx={{ width: '90px' }} icon={<RiGitRepositoryPrivateFill />} label="private" variant="outlined" />
              )}
            </Box>
          </CardActions>
          <Divider variant="middle" />
          <Box sx={{ mb: '20px', mt: '12px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
            <Button
              variant="contained"
              size="small"
              sx={{ backgroundColor: 'hsl(169, 79%, 48%)' }}
              onClick={() => {
                setAddCommentModal(true);
              }}
            >
              Comment
            </Button>
            {viewCommentOption && (
              <Button
                sx={{ ml: '10px' }}
                variant="outlined"
                size="small"
                onClick={() => {
                  navigate(`/story/detail/${story._id}`, { state: { story, viewCommentOption: false } });
                }}
              >
                View comments
              </Button>
            )}
            {viewEditOption && (
              <Button
                sx={{ ml: '10px' }}
                variant="outlined"
                size="small"
                onClick={() => {
                  navigate(`/story/edit/${story._id}`, { state: { story } });
                }}
              >
                Edit
              </Button>
            )}
            <CommentModal
              addCommentModal={addCommentModal}
              setAddCommentModal={setAddCommentModal}
              storyId={story._id}
            />
          </Box>
        </Card>
      </Box>
    );
  },
);
StoryCard.defaultProps = {
  viewEditOption: false,
  upvoteStory: undefined,
  downvoteStory: undefined,
  pageIndex: 0,
};
StoryCard.displayName = 'StoryCard';
export default StoryCard;
