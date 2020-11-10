export const initialState = {
  selected: '',
};

export const ObserverReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_POST': {
      return action.payload;
    }
    default:
      return state;
  }
};
