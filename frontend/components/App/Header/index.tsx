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

import { useStooa } from 'contexts/StooaManager';
import { Header as HeaderStyled } from 'layouts/App/styles';

const Logo = dynamic(import('components/Common/Logo'), { loading: () => <div /> });
const StatusBar = dynamic(import('components/App/StatusBar'), { loading: () => <div /> });
const ModeratorActions = dynamic(import('components/App/ModeratorActions'), {
  loading: () => <div />
});
const Participants = dynamic(import('components/App/Participants'), { loading: () => <div /> });
const FishbowlInfo = dynamic(import('components/App/FishbowlInfo'), { loading: () => <div /> });
const Onboarding = dynamic(import('components/App/Onboarding'), { loading: () => <div /> });

interface IProps {
  toggleParticipants: () => void;
}

const Header: React.FC<IProps> = ({ toggleParticipants }) => {
  const { data, isModerator, conferenceStatus, timeStatus, conferenceReady } = useStooa();
  const router = useRouter();
  const { fid } = router.query;

  return (
    <HeaderStyled>
      <div className="hide-desktop header-top">
        <Logo />
        <StatusBar
          isModerator={isModerator}
          data={data}
          conferenceStatus={conferenceStatus}
          timeStatus={timeStatus}
        />
      </div>
      <div className="header-info">
        <FishbowlInfo data={data} />
        <Onboarding initialized={conferenceReady} isModerator={isModerator} />
      </div>
      <div className="header-actions">
        {isModerator && (
          <div className="hide-mobile">
            <ModeratorActions fid={fid as string} conferenceStatus={conferenceStatus} />
          </div>
        )}
        <div className="hide-mobile">
          <StatusBar
            isModerator={isModerator}
            data={data}
            conferenceStatus={conferenceStatus}
            timeStatus={timeStatus}
          />
        </div>
        <Participants
          initialized={conferenceReady}
          fid={fid as string}
          toggleParticipants={toggleParticipants}
        />
      </div>
    </HeaderStyled>
  );
};

export default Header;
