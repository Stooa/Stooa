/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import { Fishbowl } from '@/types/api-platform';
import useTranslation from 'next-translate/useTranslation';
import {
  StyledInvitationHero,
  StyledInvitationContent,
  StyledInvitationLanding,
  StyledFixedFishbowlData,
  StyledInvitationFormWrapper
} from './styles';
import FishbowlDataCard from '../FishbowlDataCard';
import Image from 'next/image';
import { RegisterInvitation } from '../Forms/RegisterInvitation';

interface Props {
  fishbowl: Fishbowl;
}

const FishbowlInvitationLanding = ({ fishbowl }: Props) => {
  const { invitationTitle, invitationSubtitle, invitationText, startDateTimeTz } = fishbowl;
  const { lang } = useTranslation();

  console.log('RAMON ------->', fishbowl);

  const startDateTime = new Date(startDateTimeTz);

  const localFormatDate = new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(startDateTime);

  return (
    <StyledInvitationLanding>
      <StyledInvitationContent>
        <StyledInvitationHero>
          <h1 className="title-lg">{invitationTitle}</h1>
          <h2 className="title-md">{localFormatDate}</h2>
          <p>{invitationSubtitle}</p>
          <Button size="large">Me apunto</Button>
        </StyledInvitationHero>

        <div className="fishbowl-preview">
          <Image
            src="/img/web/stooa-preview.png"
            priority
            alt="Stooa fishbowl event"
            width={720}
            height={448}
          />
        </div>

        <div dangerouslySetInnerHTML={{ __html: invitationText ?? '' }}></div>

        <StyledInvitationFormWrapper>
          <h3 className="title-sm">Apúntate al Fishbowl. ¡Es gratis!</h3>
          <RegisterInvitation />
        </StyledInvitationFormWrapper>
      </StyledInvitationContent>
      <StyledFixedFishbowlData>
        <FishbowlDataCard data={fishbowl} />
      </StyledFixedFishbowlData>
    </StyledInvitationLanding>
  );
};

export default FishbowlInvitationLanding;
