import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { BsFillGridFill } from 'react-icons/bs';
import { RiListUnordered } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StoryCard, { Story } from '../components/StoryCard';
import SortSelect from '../components/SortSelect';

function PersonalStories() {
  const storyLimit = 5;
  const { ref, inView } = useInView();
  const [sort, setSort] = useState('createdAt');
  const [displayList, setDisplayList] = useState(false);

  const fetchStories = (pageParam: number) =>
    axios
      .get(`http://localhost:5000/api/v1/story/all?limit=${storyLimit}&page=${pageParam}&sort=${sort}`, {
        withCredentials: true,
      })
      .then((response) => response.data.stories);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage, refetch, isRefetching, isFetching } =
    useInfiniteQuery('personal-stories', ({ pageParam = 0 }) => fetchStories(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === storyLimit ? allPages.length : undefined;
        return nextPage;
      },
    });

  useEffect(() => {
    refetch();
  }, [sort, refetch]);
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
          {index + 1 === page.length ? (
            <StoryCard story={story} ref={ref} viewCommentOption viewEditOption />
          ) : (
            <StoryCard story={story} viewEditOption viewCommentOption />
          )}
        </Box>
      )),
    );
  return (
    <>
      <Navbar />
      {(isRefetching || isFetching) && <LinearProgress />}
      <Typography
        sx={{ textAlign: 'center', fontSize: '20px', my: '12px', pb: '12px', borderBottom: '1px solid black' }}
      >
        Stories you posted
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <SortSelect sort={sort} setSort={setSort} />
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
export default PersonalStories;
