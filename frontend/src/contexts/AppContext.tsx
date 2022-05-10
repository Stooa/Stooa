/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useReducer, Dispatch, Reducer } from 'react';
import { IConferenceStatus } from '@/jitsi/Status';
import createGenericContext from '@/contexts/createGenericContext';

const FISHBOWL_STARTED = 'FISHBOWL_STARTED';
const FISHBOWL_READY = 'FISHBOWL_READY';
const FISHBOWL_STATUS = 'FISHBOWL_STATUS';
const FISHBOWL_ENDED = 'FISHBOWL_ENDED';
const JOIN_GUEST = 'JOIN_GUEST';
const JOIN_USER = 'JOIN_USER';
const PREJOIN_RESET = 'PREJOIN_RESET';
const START_FISHBOWL_NOW = 'START_FISHBOWL_NOW';

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

type startFishbowlNow = {
  type: typeof START_FISHBOWL_NOW;
  prejoin: boolean;
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

type prejoinResetAction = {
  type: typeof PREJOIN_RESET;
  prejoin: boolean;
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
  | joinUserAction
  | prejoinResetAction
  | startFishbowlNow;

type AppContextReducer = Reducer<State, Actions>;

const reducer: AppContextReducer = (state, action) => {
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
  conferenceStatus: CONFERENCE_NOT_STARTED
};

const [useStateValue, StateContextProvider] = createGenericContext<[State, Dispatch<Actions>]>();

const StateProvider = ({ updateState = {}, children }) => (
  <StateContextProvider value={useReducer(reducer, { ...initialState, ...updateState })}>
    {children}
  </StateContextProvider>
);

export { initialState, StateProvider, useStateValue };
