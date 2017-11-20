const DEFAULT_STATE = {
  loggedIn: false,
  loading: false,
  deviceToken: null,
  notifications: {
    all: true,
  },
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedIn: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
      };
    case 'UPDATE_LOADING':
      return {
        ...state,
        loading: !state.loading,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        deviceToken: action.payload.token,
      };
    default:
      return state;
  }
};
