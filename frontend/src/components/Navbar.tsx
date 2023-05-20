import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';

const pages = ['Trending', 'LeaderBoard', 'Engagement'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
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
    <AppBar position="static" sx={{ backgroundColor: 'hsl(180, 10%, 66%)' }}>
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

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
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
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button onClick={handleTrending} sx={{ my: 2, color: 'white', display: 'block' }}>
              Trending
            </Button>
            <Button onClick={handleLeaderBoard} sx={{ my: 2, color: 'white', display: 'block' }}>
              LeaderBoard
            </Button>
            <Button onClick={handleEngagement} sx={{ my: 2, color: 'white', display: 'block' }}>
              Engagement
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={createStoryHandler}>
                <Typography textAlign="center">Create story</Typography>
              </MenuItem>
              <MenuItem onClick={myStoryHandler}>
                <Typography textAlign="center">My stories</Typography>
              </MenuItem>
              <MenuItem
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
              >
                <Typography textAlign="center">create story</Typography>
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
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
