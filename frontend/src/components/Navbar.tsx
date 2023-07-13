import { LoadingButton } from '@mui/lab';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { updateLoginStatus } from '../features/auth/authSlice';
import axios from '../utils/axios';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetail = useSelector((state: RootState) => state.user);

  const logoutMutation = useMutation(
    () => axios({ url: 'api/v1/auth/logout', method: 'POST', withCredentials: true }),
    {
      onSuccess: () => {
        dispatch(updateLoginStatus(false));
      },
    },
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const createStoryHandler = () => {
    handleCloseUserMenu();
    navigate('/story/new');
  };
  const handleEngagement = () => {
    handleCloseNavMenu();
    navigate('/engagement');
  };
  const handleLeaderBoard = () => {
    handleCloseNavMenu();
    navigate('/leaderboard');
  };

  const handleTrending = () => {
    handleCloseNavMenu();
    navigate('/trending');
  };
  const myStoryHandler = () => {
    handleCloseNavMenu();
    navigate('/stories/me');
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: 'hsl(200,18%,48%)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                noWrap
                component="h1"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'sans-serif',
                  fontSize: '36px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  mr: '2px',
                  color: 'hsl(169, 79%, 48%)',
                }}
              >
                Digital
              </Typography>
              <Typography
                component="span"
                sx={{
                  mr: 2,
                  fontStyle: 'italic',
                  fontSize: '24px',
                  textDecoration: 'none',
                  display: { xs: 'none', md: 'flex' },
                  color: 'hsl(169, 79%, 50%)',
                }}
              >
                Stories
              </Typography>
            </Box>
          </Link>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', flexGrow: '1' }}>
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  textDecoration: 'none',
                  color: 'hsl(169, 79%, 48%)',
                }}
              >
                DigitalStories
              </Typography>
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', gap: '12px' } }}>
            <Box sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link to="/trending" style={{ textDecoration: 'none', color: 'inherit' }}>
                TRENDING
              </Link>
            </Box>
            <Box sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link to="/engagement" style={{ textDecoration: 'none', color: 'inherit' }}>
                ENGAGEMENT
              </Link>
            </Box>
            <Box sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link to="/leaderboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                LEADERBOARD
              </Link>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="options">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={userDetail?.username ?? 'username'}
                  src={
                    userDetail?.profilepic !== null
                      ? `${process.env.environment === 'development' ? process.env.SERVER_URL : ''}/public/profile/${
                          userDetail.profilepic
                        }`
                      : ''
                  }
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px', color: 'hsl(180, 62%, 29%)' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              // disableScrollLock
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={createStoryHandler}>
                <Typography textAlign="center">Create Story</Typography>
              </MenuItem>
              <MenuItem onClick={myStoryHandler}>
                <Typography textAlign="center">My Stories</Typography>
              </MenuItem>
              <MenuItem
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
                onClick={handleLeaderBoard}
              >
                <Typography textAlign="center">LeaderBoard</Typography>
              </MenuItem>
              <MenuItem
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
                onClick={handleTrending}
              >
                <Typography textAlign="center">Trending</Typography>
              </MenuItem>
              <MenuItem
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
                onClick={handleEngagement}
              >
                <Typography textAlign="center">Engagement</Typography>
              </MenuItem>
              <MenuItem>
                <LoadingButton
                  onClick={handleLogout}
                  loading={logoutMutation.isLoading}
                  variant="text"
                  sx={{
                    color: 'hsl(169,40%,55%)',
                    '.MuiLoadingButton-loadingIndicator': {
                      color: 'hsl(169, 79%, 48%)',
                    },
                  }}
                >
                  Logout
                </LoadingButton>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
