/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { createContext, Dispatch, FunctionComponent, Reducer, useContext, useReducer } from 'react';
import { IConferenceStatus } from '@/jitsi/Status';

const reducer = (state: StateInterface, action: StateActions) => {
  const allowedActions = [
    'FISHBOWL_STARTED',
    'FISHBOWL_READY',
    'FISHBOWL_STATUS',
    'FISHBOWL_ENDED',
    'JOIN_GUEST',
    'JOIN_USER'
  ];
  const { type, ...actionData } = action;

  if (allowedActions.includes(type)) {
    return {
      ...state,
      ...actionData
    };
  }

  return state;
};

interface StateProviderInterface {
  updateState?: StateInterface;
}

interface StateInterface {
  fishbowlReady: boolean;
  fishbowlStarted: boolean;
  isGuest: boolean;
  prejoin: boolean;
  conferenceStatus: IConferenceStatus;
}

interface FishbowlStatusAction {
  conferenceStatus: IConferenceStatus;
  type: 'FISHBOWL_STATUS';
}

interface FishbowlReadyAction {
  fishbowlReady: boolean;
  type: 'FISHBOWL_READY';
}

interface FishbowlStartedAction {
  fishbowlStarted: boolean;
  type: 'FISHBOWL_STARTED';
}

interface JoinGuestAction {
  isGuest: boolean;
  prejoin: boolean;
  type: 'JOIN_GUEST';
}

interface JoinUserAction {
  prejoin: boolean;
  type: 'JOIN_USER';
}

interface ResetAction {
  fishbowlReady: boolean;
  fishbowlStarted: boolean;
  isGuest: boolean;
  prejoin: boolean;
  conferenceStatus: IConferenceStatus;
  type: 'RESET';
}

type StateActions = FishbowlStatusAction | FishbowlReadyAction | FishbowlStartedAction | JoinGuestAction | JoinUserAction | ResetAction;
type StateContextInterface = [StateInterface, Dispatch<StateActions>];

const initialState = {
  fishbowlReady: false,
  fishbowlStarted: false,
  isGuest: false,
  prejoin: true,
  conferenceStatus: IConferenceStatus?.NOT_STARTED
};

const StateContext = createContext<StateContextInterface>(undefined!);

const StateProvider: FunctionComponent<StateProviderInterface> = ({ updateState = {}, children }) => (
  <StateContext.Provider value={useReducer<Reducer<StateInterface, StateActions>>(reducer, { ...initialState, ...updateState })}>
    {children}
  </StateContext.Provider>
);

const useStateValue = () => useContext(StateContext);

export { initialState, StateContext, StateProvider, useStateValue };
