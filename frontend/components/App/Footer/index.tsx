/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';

import { useStooa } from 'contexts/StooaManager';
import { Footer as FooterStyled } from 'layouts/App/styles';
import { Alert } from 'components/App/Footer/styles';

const ToolBar = dynamic(import('components/App/ToolBar'), { loading: () => <div /> });
const Logo = dynamic(import('components/Common/Logo'), { loading: () => <div /> });
const ModeratorActions = dynamic(import('components/App/ModeratorActions'), {
  loading: () => <div />,
});

interface IProps {
  participantsActive: boolean;
}

const Footer: React.FC<IProps> = ({ participantsActive }) => {
  const { onIntroduction, isModerator, conferenceStatus } = useStooa();
  const { t } = useTranslation('app');
  const router = useRouter();
  const { fid } = router.query;

  return (
    <FooterStyled className={participantsActive ? 'drawer-open' : ''}>
      {onIntroduction && <Alert className="info">{t('notification.joinAfterIntroduction')}</Alert>}
      <div className="col-left hide-mobile">
        <Logo />
      </div>
      <div className="col-mid">
        <ToolBar />
      </div>
      <div className="col-right">
        {isModerator && (
          <div className="hide-desktop moderator-actions">
            <ModeratorActions fid={fid as string} conferenceStatus={conferenceStatus} />
          </div>
        )}
      </div>
    </FooterStyled>
  );
};

export default Footer;
