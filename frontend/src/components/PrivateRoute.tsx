import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../app/store';

function PrivateRoutes() {
  // const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isLoggedIn = true;
  return isLoggedIn ? <Outlet /> : <Navigate to="/signin" />;
}
export default PrivateRoutes;
