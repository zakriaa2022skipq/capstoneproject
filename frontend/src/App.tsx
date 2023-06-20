import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import PrivateRoutes from './components/PrivateRoute';
import { updateLoginStatus } from './features/auth/authSlice';
import { updateUserState } from './features/user/userSlice';
import CreateStory from './pages/CreateStory';
import EditStory from './pages/EditStory';
import Engagement from './pages/Engagement';
import Home from './pages/Home';
import Landing from './pages/Landing';
import LeaderBoard from './pages/LeaderBoard';
import Login from './pages/Login';
import PersonalStories from './pages/PersonalStories';
import Register from './pages/Register';
import StoryDetail from './pages/StoryDetail';
import Trending from './pages/Trending';
import axios from './utils/axios';
import CatchAll from './components/CatchAll';

function App() {
  const dispatch = useDispatch();
  const getUserDetail = () => axios.get('api/v1/auth/me', { withCredentials: true }).then((response) => response.data);

  const query = useQuery('userDetail', getUserDetail, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    retry: false,
    onSuccess: (data) => {
      dispatch(updateLoginStatus(true));
      dispatch(updateUserState(data.userDetail));
    },
  });

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
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </div>
  );
}

export default App;
