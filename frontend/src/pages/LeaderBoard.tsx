import { Alert, AlertTitle, Box, Chip, CircularProgress, Divider, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BsFillFilePersonFill } from 'react-icons/bs';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

interface Leader {
  totalStories: number;
  totalUpvotes: number;
  user: {
    name: string;
    username: string;
    profilepic: string;
  };
}

function LeaderBoard() {
  const limit = 5;
  const { ref, inView } = useInView();
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const fetchLeaders = (pageParam: number) =>
    axios
      .get(`api/v1/story/leaderboard?limit=${limit}&page=${pageParam}`, {
        withCredentials: true,
      })
      .then((response) => response.data.leaders);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching, isRefetching, isError } =
    useInfiniteQuery('leaders', ({ pageParam = 0 }) => fetchLeaders(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === limit ? allPages.length : undefined;
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
  const leaders =
    isSuccess &&
    data.pages.map((page) =>
      page.map((leader: Leader, index: number) => (
        <Box
          key={leader.user.username}
          ref={index + 1 === page.length ? ref : null}
          sx={{ display: 'flex', gap: '12px', p: '12px', border: '1px solid hsl(180, 27%, 58%)' }}
        >
          <Box sx={{ width: '100px', height: '100px', borderRadius: '4px' }}>
            {leader.user.profilepic && (
              <img
                width="75px"
                height="100px"
                style={{ display: 'block', margin: '0 auto' }}
                src={`${process.env.environment === 'development' ? process.env.SERVER_URL : ''}/public/profile/${
                  leader.user.profilepic
                }`}
                alt={leader.user.name}
              />
            )}
            {!leader.user.profilepic && (
              <Box sx={{ width: '100px', height: '100px' }}>
                <BsFillFilePersonFill style={{ display: 'block', width: '100%', height: '100%' }} />
              </Box>
            )}
          </Box>
          <Box sx={{ color: 'hsl(180, 40%, 40%)' }}>
            <Typography>Username: {leader.user.username}</Typography>
            <Divider component="li" sx={{ listStyle: 'none', mb: '12px' }} />
            <Typography>Total stories posted: {leader.totalStories}</Typography>
            <Divider component="li" sx={{ listStyle: 'none', mb: '12px' }} />
            <Typography>Total upvotes received: {leader.totalUpvotes}</Typography>
            <Divider component="li" sx={{ listStyle: 'none', mb: '12px' }} />
          </Box>
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
        <Chip label="LeaderBoard" />
      </Divider>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          justifyItems: 'center',
          gap: '24px',
          mx: '16px',
        }}
      >
        {leaders}
      </Box>
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
export default LeaderBoard;
