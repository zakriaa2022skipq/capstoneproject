import { Alert, AlertTitle, Box, Button, Card, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Comment, { StoryComment } from '../components/Comment';
import Navbar from '../components/Navbar';
import StoryCard from '../components/StoryCard';
import axios from '../utils/axios';

function StoryDetail() {
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const { storyId } = useParams();
  const navigate = useNavigate();
  const fetchStory = useQuery(
    `fetchStoryDetail-${storyId}`,
    () => axios.get(`api/v1/story/detail/${storyId}/`, { withCredentials: true }).then((response) => response.data),
    {
      onError: (error: AxiosError) => {
        if (error.response) {
          if (typeof error.response.data === 'string') {
            if (error.response.data === 'Story not accessable') {
              navigate('/home');
            }
          } else {
            navigate('/404');
          }
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
        setShowAlert(true);
      },
      retry: 2,
    },
  );
  const commentLimit = 10;
  const fetchComments = (pageParam: number) =>
    axios
      .get(`api/v1/story/${storyId}/comment/?limit=${commentLimit}&page=${pageParam}`, {
        withCredentials: true,
      })
      .then((response) => response.data.comments);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refetch, isFetching } =
    useInfiniteQuery(`story-detail-${storyId}`, ({ pageParam = 0 }) => fetchComments(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === commentLimit ? allPages.length : undefined;
        return nextPage;
      },
    });
  const comments =
    isSuccess &&
    data.pages.map((page) =>
      page.map((comment: StoryComment) => (
        <Box key={comment._id}>
          <Comment comment={comment} refetch={refetch} />
        </Box>
      )),
    );
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <Navbar />
      {fetchStory.isLoading && (
        <Box
          sx={{
            color: 'hsl(180, 43%, 41%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: '16px',
          }}
          data-testid="loading"
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
      <Card variant="outlined" sx={{ width: 420, maxWidth: { xs: '300px', md: '390px', sm: '340px' }, mb: '12px' }}>
        {fetchStory.isError && showAlert && (
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
        {fetchStory.isSuccess && (
          <StoryCard
            story={fetchStory.data.story[0]}
            refetch={fetchStory.refetch}
            viewCommentOption={false}
            refetchAddComment={refetch}
            viewFollowOption
          />
        )}
        {isLoading && (
          <Box
            sx={{
              color: 'hsl(180, 43%, 41%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              my: '16px',
            }}
            data-testid="loading"
          >
            <CircularProgress color="inherit" />
          </Box>
        )}
        {comments !== false && comments.length > 0 && (
          <Box sx={{ maxWidth: '100%', backgroundColor: 'hsl(185, 10%, 95%)' }}>{comments}</Box>
        )}
        {isSuccess && data?.pages[0].length === 0 && !isFetching && (
          <Typography
            sx={{
              fontSize: '16px',
              p: '8px',
              textAlign: 'center',
              color: 'hsl(180, 55%, 38%)',
              maxWidth: '80vw',
              mx: 'auto',
            }}
          >
            Story has no comments.
          </Typography>
        )}
        {hasNextPage && (
          <Button
            onClick={() => {
              fetchNextPage();
            }}
            variant="text"
          >
            Load more...
          </Button>
        )}
        {isFetchingNextPage && (
          <Box sx={{ color: 'hsl(180, 43%, 41%)' }}>
            <LinearProgress color="inherit" />
          </Box>
        )}
      </Card>
    </Box>
  );
}
export default StoryDetail;
