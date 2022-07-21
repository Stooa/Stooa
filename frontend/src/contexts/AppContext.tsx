/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { createContext, useContext, useReducer, Dispatch, Reducer } from 'react';
import { IConferenceStatus } from '@/jitsi/Status';

const FISHBOWL_STARTED = 'FISHBOWL_STARTED';
const FISHBOWL_READY = 'FISHBOWL_READY';
const FISHBOWL_STATUS = 'FISHBOWL_STATUS';
const FISHBOWL_ENDED = 'FISHBOWL_ENDED';
const JOIN_GUEST = 'JOIN_GUEST';
const JOIN_USER = 'JOIN_USER';

interface State {
  fishbowlReady: boolean;
  fishbowlStarted: boolean;
  isGuest: boolean;
  prejoin: boolean;
  conferenceStatus: IConferenceStatus;
}

type fishbowlStartedAction = {
  type: typeof FISHBOWL_STARTED;
  fishbowlStarted: boolean;
};

type fishbowlReadyAction = {
  type: typeof FISHBOWL_READY;
  fishbowlReady: boolean;
};

type fishbowlStatusAction = {
  type: typeof FISHBOWL_STATUS;
  fishbowlReady?: boolean;
  fishbowlStarted?: boolean;
  isGuest?: boolean;
  prejoin?: boolean;
  conferenceStatus: IConferenceStatus;
};

type fishbowlEndedAction = {
  type: typeof FISHBOWL_ENDED;
  conferenceStatus: IConferenceStatus;
};

type joinGuestAction = {
  type: typeof JOIN_GUEST;
  isGuest: boolean;
  prejoin: boolean;
};

type joinUserAction = {
  type: typeof JOIN_USER;
  prejoin?: boolean;
  isGuest?: boolean;
};

type Actions =
  | fishbowlStartedAction
  | fishbowlReadyAction
  | fishbowlStatusAction
  | fishbowlEndedAction
  | joinGuestAction
  | joinUserAction;

type FooReducer = Reducer<State, Actions>;

const reducer: FooReducer = (state, action) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...actionData } = action;

  return {
    ...state,
    ...actionData
  };
};

const initialState: State = {
  fishbowlReady: false,
  fishbowlStarted: false,
  isGuest: false,
  prejoin: true,
  conferenceStatus: IConferenceStatus?.NOT_STARTED
};

const StateContext = createContext<[State, Dispatch<Actions>]>(undefined);

const StateProvider = ({ updateState = {}, children }) => (
  <StateContext.Provider value={useReducer(reducer, { ...initialState, ...updateState })}>
    {children}
  </StateContext.Provider>
);

const useStateValue = () => useContext(StateContext);

export { initialState, StateContext, StateProvider, useStateValue };
