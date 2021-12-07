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

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  Start = 'FISHBOWL_STARTED',
  Ready = 'FISHBOWL_READY',
  Status = 'FISHBOWL_STATUS',
  JoinGuest = 'JOIN_GUEST',
  JoinUser = 'JOIN_USER'
}

type FishbowlType = {
  fishbowlReady: boolean;
  fishbowlStarted: boolean;
  isGuest: boolean;
  prejoin: boolean;
  conferenceStatus: IConferenceStatus;
};

type FishbowlPayload = {
  [Types.Start]: {
    fishbowlStarted: boolean;
  };
  [Types.Ready]: {
    fishbowlReady: boolean;
  };
  [Types.Status]: {
    conferenceStatus: IConferenceStatus;
  };
  [Types.JoinGuest]: {
    isGuest: boolean;
    prejoin: boolean;
  };
  [Types.JoinUser]: {
    prejoin: boolean;
  };
};

export type FishbowlActions = ActionMap<FishbowlPayload>[keyof ActionMap<FishbowlPayload>];

interface Provider {
  updateState: Record<string, unknown>;
}

const reducer = (state: FishbowlType[], action: FishbowlActions) => {
  if (action.type) {
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

const StateContext = createContext<{
  state: FishbowlType;
  dispatch: Dispatch<FishbowlActions>;
}>({ state: initialState, dispatch: () => null });

const StateProvider: React.FC<Provider> = ({ updateState = {}, children }) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...updateState });

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};

const useStateValue = () => useContext(StateContext);

export { initialState, StateContext, StateProvider, useStateValue };
