import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import { useInfiniteQuery, useMutation } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { BsFillGridFill } from 'react-icons/bs';
import { RiListUnordered } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StoryCard, { Story } from '../components/StoryCard';
import SortSelect from '../components/SortSelect';

function Home() {
  const storyLimit = 5;
  const { ref, inView } = useInView();
  const [sort, setSort] = useState('createdAt');
  const [displayList, setDisplayList] = useState(false);

  const fetchStories = (pageParam: number) =>
    axios
      .get(`http://localhost:5000/api/v1/story/timeline?limit=${storyLimit}&page=${pageParam}&sort=${sort}`, {
        withCredentials: true,
      })
      .then((response) => response.data.stories);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage, refetch, isRefetching, isFetching } =
    useInfiniteQuery('timeline-stories', ({ pageParam = 0 }) => fetchStories(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === storyLimit ? allPages.length : undefined;
        return nextPage;
      },
    });
  const upvoteStory = useMutation((storyId) =>
    axios({ url: `http://localhost:5000/api/v1/story/${storyId}/upvote`, withCredentials: true, method: 'PATCH' }),
  );
  const downvoteStory = useMutation((storyId) =>
    axios({ url: `http://localhost:5000/api/v1/story/${storyId}/downvote`, withCredentials: true, method: 'PATCH' }),
  );

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
    data.pages.map((page, pageIndex) =>
      page.map((story: Story, index: number) => (
        <Box key={story._id}>
          {index + 1 === page.length ? (
            <StoryCard
              story={story}
              upvoteStory={upvoteStory}
              downvoteStory={downvoteStory}
              ref={ref}
              pageIndex={pageIndex}
              refetch={refetch}
              viewCommentOption
            />
          ) : (
            <StoryCard
              pageIndex={pageIndex}
              refetch={refetch}
              story={story}
              upvoteStory={upvoteStory}
              downvoteStory={downvoteStory}
              viewCommentOption
            />
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
        Stories from people you follow
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

export default Home;
