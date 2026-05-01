import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, logout } from '../../store/authSlice';
import { authService } from '../../services/authService';

const AuthInit = ({ children }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    // On page refresh: localStorage has a token but Redux state is reset to initial.
    // status starts as 'idle' — this is the signal to hydrate from the token.
    const token = authService.getAuthToken();
    if (token && status === 'idle') {
      dispatch(fetchCurrentUser());
    }

    const handleUnauthorized = () => {
      dispatch(logout());
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch, status]);

  return children;
};

export default AuthInit;
