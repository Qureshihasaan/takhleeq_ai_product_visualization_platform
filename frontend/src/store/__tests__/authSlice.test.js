import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
  loginSuccess,
  logout,
  fetchCurrentUser,
} from '../authSlice';

const makeInitialState = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  ...overrides,
});

describe('authSlice', () => {
  describe('loginSuccess', () => {
    it('sets isAuthenticated to true and stores the user', () => {
      const state = authReducer(makeInitialState(), loginSuccess({ username: 'alice', email: 'alice@test.com' }));
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.username).toBe('alice');
      expect(state.error).toBeNull();
    });

    it('resets status to idle so AuthInit will re-fetch user profile', () => {
      const prev = makeInitialState({ status: 'failed' });
      const state = authReducer(prev, loginSuccess(null));
      expect(state.status).toBe('idle');
    });
  });

  describe('logout', () => {
    it('clears user and sets isAuthenticated to false', () => {
      const prev = makeInitialState({
        user: { username: 'alice' },
        isAuthenticated: true,
        status: 'succeeded',
      });
      const state = authReducer(prev, logout());
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.status).toBe('idle');
    });
  });

  describe('fetchCurrentUser async thunk', () => {
    it('sets status to loading on pending', () => {
      const state = authReducer(makeInitialState(), { type: fetchCurrentUser.pending.type });
      expect(state.status).toBe('loading');
    });

    it('sets user and status succeeded on fulfilled', () => {
      const user = { username: 'alice', email: 'alice@test.com', role: 'buyer' };
      const state = authReducer(
        makeInitialState(),
        { type: fetchCurrentUser.fulfilled.type, payload: user }
      );
      expect(state.status).toBe('succeeded');
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('sets status failed and clears user on rejected', () => {
      const prev = makeInitialState({ user: { username: 'alice' }, isAuthenticated: true });
      const state = authReducer(
        prev,
        { type: fetchCurrentUser.rejected.type, payload: 'Unauthorized' }
      );
      expect(state.status).toBe('failed');
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Unauthorized');
    });
  });
});
