/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

export const createGenericContext = <T>() => {
  const genericContext = React.createContext<T | undefined>(undefined);

  const useGenericContext = () => {
    const contextIsDefined = React.useContext(genericContext);
    if (!contextIsDefined) {
      throw new Error('useGenericContext must be used within a Provider');
    }
    return contextIsDefined;
  };

  return [useGenericContext, genericContext.Provider] as const;
};
