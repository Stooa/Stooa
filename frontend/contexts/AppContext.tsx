/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import { IConferenceStatus } from '@/jitsi/Status';

type ActionMap<M> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum PayloadTypes {
  Start = 'FISHBOWL_STARTED',
  Ready = 'FISHBOWL_READY',
  Status = 'FISHBOWL_STATUS',
  JoinGuest = 'JOIN_GUEST',
  JoinUser = 'JOIN_USER'
}

interface FishbowlStatusType {
  fishbowlReady: boolean;
  fishbowlStarted: boolean;
  isGuest: boolean;
  prejoin: boolean;
  conferenceStatus: IConferenceStatus;
}

interface FishbowlPayload {
  [PayloadTypes.Start]: {
    fishbowlStarted: boolean;
  };
  [PayloadTypes.Ready]: {
    fishbowlReady: boolean;
  };
  [PayloadTypes.Status]: {
    conferenceStatus: IConferenceStatus;
  };
  [PayloadTypes.JoinGuest]: {
    isGuest: boolean;
    prejoin: boolean;
  };
  [PayloadTypes.JoinUser]: {
    prejoin: boolean;
  };
}

export type FishbowlActions = ActionMap<FishbowlPayload>[keyof ActionMap<FishbowlPayload>];

const reducer = (state: FishbowlStatusType, action: FishbowlActions) => {
  if (action.type) {
    return { ...state, ...action.payload };
  }
  return state;
};

const initialState: FishbowlStatusType = {
  fishbowlReady: false,
  fishbowlStarted: false,
  isGuest: false,
  prejoin: true,
  conferenceStatus: IConferenceStatus?.NOT_STARTED
};

const StateContext = createContext<{
  state: FishbowlStatusType;
  dispatch: Dispatch<FishbowlActions>;
}>({ state: initialState, dispatch: () => null });

const StateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};

const useStateValue = () => useContext(StateContext);

export { initialState, StateContext, StateProvider, useStateValue };
