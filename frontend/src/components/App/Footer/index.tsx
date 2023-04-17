/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { useStooa } from '@/contexts/StooaManager';
import { Footer as FooterStyled } from '@/layouts/App/styles';
import IntroNotification from '@/components/App/IntroNotification';
import ButtonFeedback from '../ButtonFeedback';
import { useNavigatorType } from '@/hooks/useNavigatorType';

const ToolBar = dynamic(import('@/components/App/ToolBar'), { loading: () => <div /> });
const Logo = dynamic(import('@/components/Common/Logo'), { loading: () => <div /> });
const ModeratorActions = dynamic(import('@/components/App/ModeratorActions'), {
  loading: () => <div />
});

const Footer = () => {
  const { onIntroduction, isModerator, conferenceStatus, gaveFeedback, data, participantsActive } =
    useStooa();
  const router = useRouter();
  const { fid } = router.query;
  const { deviceType } = useNavigatorType();

  return (
    <FooterStyled className={participantsActive ? 'drawer-open' : ''}>
      {onIntroduction && !isModerator && <IntroNotification />}
      <div className="col-left hide-mobile">
        <Logo />
      </div>
      <div className="moderator-actions">
        {isModerator && (
          <div className="hide-desktop">
            <ModeratorActions fid={fid as string} conferenceStatus={conferenceStatus} />
          </div>
        )}
      </div>
      <div className="user-actions">
        <ToolBar />
      </div>
      {!isModerator && deviceType === 'Desktop' && (
        <ButtonFeedback disabled={gaveFeedback} fishbowl={data} drawerOpened={participantsActive} />
      )}
    </FooterStyled>
  );
};

export default Footer;
