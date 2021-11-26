/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as React from 'react';

export interface AppButtonConfig {
  handleAudioInput: (event: React.MouseEvent) => void;
  handleAudioOutput: (event: React.MouseEvent) => void;
  handleVideoInput: (event: React.MouseEvent) => void;
  handleShowDevices: (shouldShowDevices?: boolean) => void;
}
