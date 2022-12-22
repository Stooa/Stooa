/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Dispatch, SetStateAction } from 'react';

export interface ModalsContextValues {
  showOnBoardingModal: boolean;
  setShowOnBoardingModal: Dispatch<SetStateAction<boolean>>;
  toggleOnBoarding: (location: string) => void;
  activeOnBoardingTooltip: boolean;
  setActiveOnBoardingTooltip: Dispatch<SetStateAction<boolean>>;
  onBoardingTooltipSeen: boolean;
  setOnBoardingTooltipSeen: Dispatch<SetStateAction<boolean>>;
  showConfirmCloseTabModal: boolean;
  setShowConfirmCloseTabModal: Dispatch<SetStateAction<boolean>>;
  showOnBoardingTour: boolean;
  setShowOnBoardingTour: Dispatch<SetStateAction<boolean>>;
  showEndIntroductionModal: boolean;
  setShowEndIntroductionModal: Dispatch<SetStateAction<boolean>>;
  showScreenSharePermissions: boolean;
  setShowScreenSharePermissions: Dispatch<SetStateAction<boolean>>;
}
