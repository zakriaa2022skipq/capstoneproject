import { Route, Routes } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PrivateRoutes from './components/PrivateRoute';
import CreateStory from './pages/CreateStory';
import StoryDetail from './pages/StoryDetail';
import Trending from './pages/Trending';
import LeaderBoard from './pages/LeaderBoard';
import Engagement from './pages/Engagement';
import PersonalStories from './pages/PersonalStories';
import EditStory from './pages/EditStory';
import { RootState } from './app/store';
import { updateUserState } from './features/user/userSlice';

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const getUserDetail = () =>
    axios.get('http://localhost:5000/api/v1/auth/me', { withCredentials: true }).then((response) => response.data);

  const query = useQuery('userDetail', getUserDetail, {
    enabled: isLoggedIn,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
  useEffect(() => {
    if (query.isSuccess) {
      dispatch(updateUserState(query.data.userDetail));
    }
  }, [query.isSuccess, dispatch, query.data]);

  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/engagement" element={<Engagement />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/stories/me" element={<PersonalStories />} />
          <Route path="/story/new" element={<CreateStory />} />
          <Route path="/story/detail/:storyId" element={<StoryDetail />} />
          <Route path="/story/edit/:storyId" element={<EditStory />} />
        </Route>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
