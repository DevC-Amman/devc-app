const DEFAULT_STATE = {
  user: {},
};

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case 'LOGIN': {
      const { user } = payload;
      return {
        ...state,
        user,
      };
    }
    case 'LOGOUT':
      return {
        ...state,
        user: {},
      };
    case 'UPDATE_USER': {
      const { user } = payload;
      return {
        ...state,
        user: { ...state.user, ...user },
      };
    }
    default:
      return state;
  }
};
