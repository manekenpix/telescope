import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { ObserverStateContext, ObserverDispatchContext } from '../ObserverContext';
import { ObserverReducer, initialState } from '../ObserverReducer';

const ObserverProvider = (props) => {
  const [state, dispatch] = useReducer(ObserverReducer, initialState);
  return (
    <ObserverStateContext.Provider value={state}>
      <ObserverDispatchContext.Provider value={dispatch}>
        {props.children}
      </ObserverDispatchContext.Provider>
    </ObserverStateContext.Provider>
  );
};

ObserverProvider.propTypes = {
  children: PropTypes.elementType,
};

export default ObserverProvider;
