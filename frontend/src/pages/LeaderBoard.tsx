import { Box, IconButton, Paper, Typography } from '@mui/material';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BsFillFilePersonFill } from 'react-icons/bs';
import Navbar from '../components/Navbar';

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
  const storyLimit = 5;
  const { ref, inView } = useInView();
  const [displayList, setDisplayList] = useState(false);

  const fetchLeaders = (pageParam: number) =>
    axios
      .get(`http://localhost:5000/api/v1/story/leaderboard?limit=${storyLimit}&page=${pageParam}`, {
        withCredentials: true,
      })
      .then((response) => response.data.leaders);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    'leaders',
    ({ pageParam = 0 }) => fetchLeaders(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === storyLimit ? allPages.length : undefined;
        return nextPage;
      },
    },
  );
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
          sx={{ display: 'flex', gap: '12px', p: '12px', border: '1px solid black' }}
        >
          <Box sx={{ width: '100px', height: '100px', borderRadius: '4px' }}>
            {leader.user.profilepic && (
              <img
                width="75px"
                height="100px"
                style={{ display: 'block', margin: '0 auto' }}
                src={`http://localhost:5000/public/profile/${leader.user.profilepic}`}
                alt={leader.user.name}
              />
            )}
            {!leader.user.profilepic && (
              <Box sx={{ width: '100px', height: '100px' }}>
                <BsFillFilePersonFill style={{ display: 'block', width: '100%', height: '100%' }} />
              </Box>
            )}
          </Box>
          <Box>
            <Typography>Username: {leader.user.username}</Typography>
            <Typography>Total stories posted: {leader.totalStories}</Typography>
            <Typography>Total upvotes received: {leader.totalUpvotes}</Typography>
          </Box>
        </Box>
      )),
    );
  return (
    <>
      <Navbar />
      <Typography
        sx={{ textAlign: 'center', fontSize: '20px', my: '12px', pb: '12px', borderBottom: '1px solid black' }}
      >
        LeaderBoard
      </Typography>

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
    </>
  );
}
export default LeaderBoard;
