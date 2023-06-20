import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BsFillGridFill } from 'react-icons/bs';
import { RiListUnordered } from 'react-icons/ri';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';
import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import Navbar from '../components/Navbar';
import StoryCard, { Story } from '../components/StoryCard';
import axios from '../utils/axios';
import styles from './grid.module.css';

function Engagement() {
  const storyLimit = 5;
  const { ref, inView } = useInView();
  const [displayList, setDisplayList] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [sort, setSort] = useState('createdAt');

  const fetchStories = (pageParam: number) =>
    axios
      .get(`api/v1/story/engagement?limit=${storyLimit}&page=${pageParam}&sort=${sort}`, {
        withCredentials: true,
      })
      .then((response) => response.data.stories);

  const {
    data,
    isSuccess,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isError,
  } = useInfiniteQuery('engagement-stories', ({ pageParam = 0 }) => fetchStories(pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length === storyLimit ? allPages.length : undefined;
      return nextPage;
    },
    onError: (error: AxiosError) => {
      if (error.response) {
        if (typeof error.response.data === 'string') {
          setErrMessage(error.response.data);
        }
      } else if (error.request) {
        setErrMessage(error.message);
      } else {
        setErrMessage(error.message);
      }
      setShowAlert(true);
    },
  });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    820: 1,
  };
  const stories =
    isSuccess &&
    data.pages.map((page) =>
      page.map((story: Story, index: number) => (
        <Box key={story._id}>
          {index + 1 === page.length ? (
            <StoryCard story={story} ref={ref} viewCommentOption refetchAddComment={refetch} refetch={refetch} />
          ) : (
            <StoryCard story={story} viewCommentOption refetchAddComment={refetch} refetch={refetch} />
          )}
        </Box>
      )),
    );
  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      {(isRefetching || isFetching) && (
        <Box sx={{ color: 'hsl(180, 43%, 41%)' }}>
          <LinearProgress color="inherit" />
        </Box>
      )}
      <Divider sx={{ my: '12px', pb: '12px' }}>
        <Chip label="Engagement Stories" />
      </Divider>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SortSelect sort={sort} setSort={setSort} />
        {isSuccess && stories && stories.length > 1 && (
          <>
            <IconButton
              sx={{ color: displayList === true ? '' : 'Highlight' }}
              onClick={() => {
                setDisplayList(false);
              }}
            >
              <BsFillGridFill />
            </IconButton>
            <IconButton
              sx={{ color: displayList === true ? 'Highlight' : '' }}
              onClick={() => {
                setDisplayList(true);
              }}
            >
              <RiListUnordered />
            </IconButton>
          </>
        )}
      </Box>
      {displayList === true && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: displayList === true ? '1fr' : 'repeat(auto-fit,minmax(430px,1fr))',
            justifyItems: 'center',
          }}
        >
          {stories}
        </Box>
      )}
      {displayList === false && (
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles['my-masonry-grid']}
            columnClassName={styles['my-masonry-grid_column']}
          >
            {stories}
          </Masonry>
        </Box>
      )}
      {isError && showAlert && (
        <Alert
          sx={{ maxWidth: '100%' }}
          onClose={() => {
            setShowAlert(false);
          }}
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>
          <Typography data-testid="error message">{errMessage}</Typography>
        </Alert>
      )}
      {isSuccess && data?.pages[0].length === 0 && !isFetching && (
        <Typography
          sx={{ fontSize: '16px', textAlign: 'center', color: 'hsl(180, 55%, 38%)', maxWidth: '80vw', mx: 'auto' }}
        >
          No stories found in your engagement. Here you will find stories you have interacted with and your stories that
          others have reacted to.
        </Typography>
      )}
      {(isFetching || isFetchingNextPage) && (
        <Box
          sx={{
            color: 'hsl(180, 43%, 41%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: '16px',
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
      {!isFetching && !isFetchingNextPage && !hasNextPage && data?.pages[0].length > 0 && (
        <Divider sx={{ mt: 'auto', p: '12px' }}>
          <Chip label="You have reached the end" />
        </Divider>
      )}
    </Box>
  );
}
export default Engagement;
