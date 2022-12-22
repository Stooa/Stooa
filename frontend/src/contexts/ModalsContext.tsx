/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback, useEffect, useState } from 'react';

import { pushEventDataLayer } from '@/lib/analytics';
import { getOnBoardingCookie } from '@/user/auth';
import { ModalsContextValues } from '@/types/contexts/modals-context';
import { useStateValue } from './AppContext';
import createGenericContext from './createGenericContext';
import { IConferenceStatus } from '@/jitsi/Status';

const [useModals, ModalsContextProvider] = createGenericContext<ModalsContextValues>();

const ModalsProvider = ({
  isModerator,
  children
}: {
  isModerator: boolean;
  children: JSX.Element;
}) => {
  const [{ conferenceStatus }] = useStateValue();

  const [showOnBoardingModal, setShowOnBoardingModal] = useState(false);
  const [showConfirmCloseTabModal, setShowConfirmCloseTabModal] = useState(false);
  const [activeOnBoardingTooltip, setActiveOnBoardingTooltip] = useState(false);
  const [onBoardingTooltipSeen, setOnBoardingTooltipSeen] = useState(false);
  const [showOnBoardingTour, setShowOnBoardingTour] = useState(false);
  const [showEndIntroductionModal, setShowEndIntroductionModal] = useState(false);
  const [showScreenSharePermissions, setShowScreenSharePermissions] = useState(false);

  const toggleOnBoarding = (location: string) => {
    pushEventDataLayer({
      action: showOnBoardingModal ? 'OnBoarding close' : 'OnBoarding open',
      category: location,
      label: window.location.href
    });

    setShowOnBoardingModal(!showOnBoardingModal);
  };

  const shouldShowOnboardingModal = useCallback(() => {
    const cookie = getOnBoardingCookie(isModerator);

    if (!cookie && conferenceStatus === IConferenceStatus.NOT_STARTED && isModerator) {
      setShowOnBoardingModal(true);
      setOnBoardingTooltipSeen(false);
    }
  }, [conferenceStatus, isModerator]);

  useEffect(() => {
    shouldShowOnboardingModal();
  }, []);

  return (
    <ModalsContextProvider
      value={{
        toggleOnBoarding,
        showOnBoardingModal,
        setShowOnBoardingModal,
        activeOnBoardingTooltip,
        setActiveOnBoardingTooltip,
        onBoardingTooltipSeen,
        setOnBoardingTooltipSeen,
        showOnBoardingTour,
        setShowOnBoardingTour,
        showConfirmCloseTabModal,
        setShowConfirmCloseTabModal,
        showEndIntroductionModal,
        setShowEndIntroductionModal,
        showScreenSharePermissions,
        setShowScreenSharePermissions
      }}
    >
      {children}
    </ModalsContextProvider>
  );
};

export { useModals, ModalsProvider };
