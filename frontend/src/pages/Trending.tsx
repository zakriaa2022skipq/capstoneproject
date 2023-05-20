import { Box, IconButton, Typography } from '@mui/material';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { BsFillGridFill } from 'react-icons/bs';
import { RiListUnordered } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StoryCard, { Story } from '../components/StoryCard';

function Trending() {
  const storyLimit = 5;
  const { ref, inView } = useInView();
  const [displayList, setDisplayList] = useState(false);

  const fetchStories = (pageParam: number) =>
    axios
      .get(`http://localhost:5000/api/v1/story/trending?limit=${storyLimit}&page=${pageParam}`, {
        withCredentials: true,
      })
      .then((response) => response.data.stories);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    'timeline-stories',
    ({ pageParam = 0 }) => fetchStories(pageParam),
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
  const stories =
    isSuccess &&
    data.pages.map((page) =>
      page.map((story: Story, index: number) => (
        <Box key={story._id}>
          {/* {story?.text} */}
          {index + 1 === page.length ? (
            <StoryCard story={story} ref={ref} viewCommentOption />
          ) : (
            <StoryCard story={story} viewCommentOption />
          )}
        </Box>
      )),
    );
  return (
    <>
      <Navbar />
      <Typography
        sx={{ textAlign: 'center', fontSize: '20px', my: '12px', pb: '12px', borderBottom: '1px solid black' }}
      >
        Trending Stories
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: displayList === true ? '1fr' : '1fr 1fr 1fr',
          justifyItems: 'center',
          mx: displayList === false ? '16px' : '',
        }}
      >
        {stories}
      </Box>
    </>
  );
}
export default Trending;
