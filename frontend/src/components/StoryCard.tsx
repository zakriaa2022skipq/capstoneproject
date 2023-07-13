import { Box, Button, Chip, CircularProgress, Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { forwardRef, useState } from 'react';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { MdPublic } from 'react-icons/md';
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { InfiniteData, QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GrEdit, GrView } from 'react-icons/gr';
import { RootState } from '../app/store';
import { useDownvoteMutation, useUpvoteMutation } from '../features/query/vote';
import axios from '../utils/axios';
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
  commentCount: number;
  isPublic?: boolean;
  _id: string;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  totalUsers: number;
  isFollowingAuthor: boolean;
  style: { color: string };
}

interface Props {
  story: Story;
  viewCommentOption: boolean;
  viewEditOption?: boolean;
  viewFollowOption?: boolean;
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<InfiniteData<any>, unknown>>;
  refetchAddComment?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<InfiniteData<any>, unknown>>;
  refetchAddCommentArg?: object;
}

const StoryCard = forwardRef(
  (
    {
      story,
      refetch,
      viewCommentOption,
      viewEditOption,
      refetchAddComment,
      refetchAddCommentArg,
      viewFollowOption,
    }: Props,
    ref,
  ) => {
    const navigate = useNavigate();
    const percentReaction = Math.round(((story.upvoteCount + story.downvoteCount) / story.totalUsers) * 100);
    const username = useSelector((state: RootState) => state.user.username);
    const upvoteStory = useUpvoteMutation({
      onSuccessFn: refetch,
    });

    const downvoteStory = useDownvoteMutation({
      onSuccessFn: refetch,
    });
    const storyDate = new Date(story.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const votes = story.upvoteCount - story.downvoteCount;
    const [addCommentModal, setAddCommentModal] = useState(false);
    const handleUpvote = () => {
      if (!downvoteStory.isLoading) {
        upvoteStory.mutate(story._id);
      }
    };

    const handleDownvote = () => {
      if (!upvoteStory.isLoading) {
        downvoteStory.mutate(story._id);
      }
    };
    const followMutation = useMutation(
      (authorUsername: string) =>
        axios({
          url: `api/v1/user/${authorUsername}/follow`,
          method: 'POST',
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
    const unfollowMutation = useMutation(
      (authorUsername: string) =>
        axios({
          url: `api/v1/user/${authorUsername}/unfollow`,
          method: 'POST',
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
    const handleFollow = () => {
      followMutation.mutate(story.author.username);
    };
    const handleUnfollow = () => {
      unfollowMutation.mutate(story.author.username);
    };
    return (
      <Box ref={ref}>
        <Card
          sx={{
            width: 420,
            maxWidth: { xs: '300px', md: '390px', sm: '340px' },
            p: '12px',
            mb: '4px',
            border: '1px solid hsl(180, 27%, 58%) ',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: '0',
              backgroundColor: story?.style?.color !== null ? story?.style?.color : 'hsl(185, 10%, 95%)',
              opacity: story?.style?.color !== null ? '0.4' : '0',
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <CardHeader
              avatar={
                <Avatar
                  src={`${process.env.environment === 'development' ? process.env.SERVER_URL : ''}/public/profile/${
                    story.author.profilepic
                  }`}
                  sx={{ bgcolor: red[500] }}
                  aria-label={story.author.username}
                >
                  {!story.author.profilepic && story.author.username[0]}
                </Avatar>
              }
              title={story.author.username}
              subheader={`${storyDate}`}
            />
            {viewFollowOption &&
              username !== story.author.username &&
              (story.isFollowingAuthor ? (
                <Button onClick={handleUnfollow}>Unfollow</Button>
              ) : (
                <Button onClick={handleFollow}>Follow</Button>
              ))}
          </Box>

          {story.image && (
            <CardMedia
              component="img"
              height="194"
              image={`/public/story/${story.image}`}
              alt="story"
              sx={{ mx: 'auto' }}
            />
          )}
          {story.video && (
            <CardMedia
              component="video"
              controls
              src={`${process.env.environment === 'development' ? process.env.SERVER_URL : ''}/public/story/${
                story.video
              }`}
              height="194"
              sx={{ mx: 'auto' }}
            />
          )}
          <CardContent>
            <Typography variant="body2" color="hsl(180, 62%, 29%)" sx={{ textAlign: 'justify' }}>
              {story.text}
            </Typography>
          </CardContent>
          <Divider variant="middle" />
          <CardActions disableSpacing sx={{ mt: '8px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {upvoteStory.isLoading ? (
              <CircularProgress size={14} sx={{ p: '4px', color: 'hsl(180, 74%, 33%)' }} />
            ) : (
              <IconButton
                aria-label="upvote"
                sx={{ p: '2px', color: story.hasUpvoted ? 'hsl(180, 74%, 33%)' : '' }}
                onClick={handleUpvote}
              >
                <BiUpvote />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Typography sx={{ fontSize: '14px' }}>{Number.isNaN(votes) ? 0 : votes}</Typography>
              <Typography sx={{ fontSize: '14px' }}>({percentReaction}%)</Typography>
            </Box>

            {downvoteStory.isLoading ? (
              <CircularProgress size={14} sx={{ p: '2px', color: 'hsl(180, 74%, 33%)' }} />
            ) : (
              <IconButton
                onClick={handleDownvote}
                aria-label="downvote"
                sx={{ p: '4px', color: story.hasDownvoted ? 'hsl(180, 74%, 33%)' : '' }}
              >
                <BiDownvote />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', gap: '4px' }}>
              <Chip
                sx={{ borderColor: 'hsl(169, 79%, 48%)', color: 'hsl(186, 41%, 46%)' }}
                label={`Upvotes:${story.upvoteCount}`}
                variant="outlined"
              />
              <Chip
                sx={{ borderColor: 'hsl(169, 79%, 48%)', color: 'hsl(186, 41%, 46%)' }}
                label={`Downvotes:${story.downvoteCount}`}
                variant="outlined"
              />
              {viewEditOption && story.isPublic && (
                <Chip
                  sx={{
                    borderColor: 'hsl(169, 79%, 48%)',
                    color: 'hsl(186, 41%, 46%)',
                  }}
                  icon={<MdPublic />}
                  label="Public"
                  variant="outlined"
                />
              )}
              {viewEditOption && !story.isPublic && (
                <Chip
                  icon={<RiGitRepositoryPrivateFill />}
                  sx={{
                    borderColor: 'hsl(169, 40%, 55%)',
                    backgroundColor: 'hsl(169, 40%, 55%)',
                    color: 'hsl(0, 0%, 100%)',
                  }}
                  label="private"
                  variant="filled"
                />
              )}
            </Box>
          </CardActions>
          <Divider variant="middle" />
          <Box
            sx={{
              mb: '20px',
              mt: '12px',
              display: 'flex',
              justifyContent: viewCommentOption ? 'center' : 'flex-start',
              gap: '4px',
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: 'hsl(169, 40%, 55%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ':hover': {
                  backgroundColor: 'hsl(169, 60%, 55%)',
                },
              }}
              onClick={() => {
                setAddCommentModal(true);
              }}
            >
              Comment
            </Button>
            {viewCommentOption && (
              <Button
                sx={{
                  ml: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'hsl(186, 41%, 46%)',
                  borderColor: 'hsl(169, 79%, 48%)',
                  fontSize: '12px',
                  ':hover': {
                    borderColor: 'hsl(169, 79%, 48%)',
                    backgroundColor: 'tranparent',
                  },
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
                variant="outlined"
                size="small"
                onClick={() => {
                  navigate(`/story/detail/${story._id}`, { state: { story, viewCommentOption: false } });
                }}
              >
                view comments {`(${story.commentCount})`}
              </Button>
            )}
            {viewCommentOption && (
              <Button
                sx={{
                  ml: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'hsl(186, 41%, 46%)',
                  borderColor: 'hsl(169, 79%, 48%)',
                  fontSize: '12px',
                  ':hover': {
                    borderColor: 'hsl(169, 79%, 48%)',
                    backgroundColor: 'tranparent',
                  },
                  display: { xs: 'inline-flex', sm: 'none' },
                }}
                variant="text"
                size="small"
                onClick={() => {
                  navigate(`/story/detail/${story._id}`, { state: { story, viewCommentOption: false } });
                }}
                title="view comments"
              >
                <GrView size="20px" />
              </Button>
            )}
            {viewEditOption && (
              <Button
                sx={{
                  ml: '10px',
                  color: 'hsl(180, 74%, 19%)',
                  borderColor: 'hsl(169, 79%, 48%)',
                  ':hover': {
                    borderColor: 'hsl(169, 40%, 55%)',
                  },
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
                variant="outlined"
                size="small"
                onClick={() => {
                  navigate(`/story/edit/${story._id}`, { state: { story } });
                }}
                title="edit story"
              >
                Edit
              </Button>
            )}
            {viewEditOption && (
              <Button
                sx={{
                  ml: '10px',
                  color: 'hsl(180, 74%, 19%)',
                  borderColor: 'hsl(169, 79%, 48%)',
                  ':hover': {
                    borderColor: 'hsl(169, 40%, 55%)',
                  },
                  display: { xs: 'inline-flex', sm: 'none' },
                  alignItems: 'center',
                }}
                variant="text"
                size="small"
                onClick={() => {
                  navigate(`/story/edit/${story._id}`, { state: { story } });
                }}
                title="edit story"
              >
                <GrEdit size="16px" />
              </Button>
            )}
            <CommentModal
              addCommentModal={addCommentModal}
              setAddCommentModal={setAddCommentModal}
              storyId={story._id}
              refetchAddComment={refetchAddComment}
              refetchAddCommentArg={refetchAddCommentArg}
            />
          </Box>
        </Card>
      </Box>
    );
  },
);
StoryCard.defaultProps = {
  viewEditOption: false,
  refetch: undefined,
  refetchAddComment: undefined,
  refetchAddCommentArg: undefined,
  viewFollowOption: false,
};
StoryCard.displayName = 'StoryCard';
export default StoryCard;
