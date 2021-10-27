/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { createContext, useContext, useReducer } from 'react';
import { IConferenceStatus } from '@/jitsi/Status';

const reducer = (state, action) => {
  const allowedActions = [
    'FISHBOWL_STARTED',
    'FISHBOWL_READY',
    'FISHBOWL_STATUS',
    'JOIN_GUEST',
    'JOIN_USER'
  ];

  if (allowedActions.includes(action.type)) {
    return {
      ...state,
      ...action
    };
  }

  return state;
};

const initialState = {
  fishbowlReady: false,
  fishbowlStarted: false,
  isGuest: false,
  prejoin: true,
  conferenceStatus: IConferenceStatus?.NOT_STARTED
};

const StateContext = createContext(undefined);

const StateProvider = ({ updateState = {}, children }) => (
  <StateContext.Provider value={useReducer(reducer, { ...initialState, ...updateState })}>
    {children}
  </StateContext.Provider>
);

const useStateValue = () => useContext(StateContext);

export { initialState, StateContext, StateProvider, useStateValue };
