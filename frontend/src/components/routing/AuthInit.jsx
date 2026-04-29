import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, logout } from '../../store/authSlice';

const AuthInit = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && status === 'idle') {
      dispatch(fetchCurrentUser());
    }

    const handleUnauthorized = () => {
      dispatch(logout());
      // We don't forcibly navigate here because AuthGuard will take over
      // when isAuthenticated becomes false.
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [dispatch, isAuthenticated, status]);

  return children;
};

export default AuthInit;
