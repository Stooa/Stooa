/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ROUTE_FISHBOWL } from '@/app.config';
import RedirectLink from '@/components/Web/RedirectLink';
import { motion, Variants } from 'framer-motion';
import Trans from 'next-translate/Trans';
import { StyledDetailPlaceholder } from './styles';
import { Fishbowl } from '@/types/api-platform';
import Button from '@/components/Common/Button';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  selectedFishbowl: Fishbowl | undefined;
  onClickBack: () => void;
  variants?: Variants;
}

const DetailPlaceholder = ({ selectedFishbowl, onClickBack }: Props) => {
  const { t } = useTranslation('fishbowl-list');
  return (
    <StyledDetailPlaceholder
      key="detail-placeholder"
      data-testid="selected-placeholder"
      as={motion.div}
      initial="initial"
      exit="exit"
      animate="visible"
      className={`${!selectedFishbowl ? 'not-selected' : ''}`}
    >
      <h2 className="body-lg medium">
        {selectedFishbowl && selectedFishbowl.name ? (
          <Trans i18nKey="fishbowl-list:fishbowlStarted" components={{ i: <i /> }} />
        ) : (
          <Trans i18nKey="fishbowl-list:noSelectedFishbowlTitle" components={{ i: <i /> }} />
        )}
      </h2>
      <p>
        {selectedFishbowl && selectedFishbowl.description ? (
          <Trans i18nKey="fishbowl-list:fishbowlStartedDescription" components={{ i: <i /> }} />
        ) : (
          <Trans i18nKey="fishbowl-list:noSelectedFishbowlDescription" components={{ i: <i /> }} />
        )}
      </p>
      {selectedFishbowl && (
        <RedirectLink
          href={`${ROUTE_FISHBOWL}/${selectedFishbowl.slug}`}
          locale={selectedFishbowl.locale}
          passHref
        >
          <Button as="a" className="enter-fishbowl" data-testid="started-enter-fishbowl">
            <span>{t('enterFishbowl')}</span>
          </Button>
        </RedirectLink>
      )}
      <Button variant="text" className="back" onClick={onClickBack}>
        <span>{t('back')}</span>
      </Button>
    </StyledDetailPlaceholder>
  );
};

export default DetailPlaceholder;
