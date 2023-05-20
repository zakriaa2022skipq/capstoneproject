import { Box, Button, Card } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import Navbar from '../components/Navbar';
import StoryCard from '../components/StoryCard';
import Comment, { StoryComment } from '../components/Comment';

function StoryDetail() {
  const { state } = useLocation();
  const commentLimit = 10;
  const fetchComments = (pageParam: number) =>
    axios
      .get(`http://localhost:5000/api/v1/story/${state.story._id}/comment/?limit=${commentLimit}&page=${pageParam}`, {
        withCredentials: true,
      })
      .then((response) => response.data.comments);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    `story-detail-${state.story._id}`,
    ({ pageParam = 0 }) => fetchComments(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === commentLimit ? allPages.length : undefined;
        return nextPage;
      },
    },
  );
  const comments =
    isSuccess &&
    data.pages.map((page) =>
      page.map((comment: StoryComment) => (
        <Box key={comment._id}>
          <Comment comment={comment} />
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
      <Card variant="outlined">
        <StoryCard story={state.story} viewCommentOption={state.viewCommentOption} />
        {comments.length > 0 && <Box sx={{ maxWidth: '345px' }}>{comments}</Box>}
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
      </Card>
    </Box>
  );
}
export default StoryDetail;
