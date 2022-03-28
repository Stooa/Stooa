/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ROUTE_FISHBOWL,
  ROUTE_FISHBOWL_CREATE,
  ROUTE_FISHBOWL_HOST_NOW,
  ROUTE_HOME
} from '@/app.config';
import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';
import { pushEventDataLayer } from '@/lib/analytics';

import RedirectLink from '@/components/Web/RedirectLink';
import LoadingIcon from '@/components/Common/LoadingIcon';
import {
  ButtonLinkColored,
  ButtonSmall,
  ButtonStyledLink,
  ButtonStyledLinkSmall
} from '@/ui/Button';
import FishbowlCard from '@/components/App/FishbowlList/FishbowlCard';
import {
  EmptyFishbowlList,
  FishbowlListWrapper,
  FishbowlScrollList,
  Header,
  FishbowlListContent,
  EditFormWrapper,
  DetailPlaceholder,
  MobileBackButton
} from '@/components/App/FishbowlList/styles';
import FishbowlForm from '@/components/Web/Forms/FishbowlForm';

import { getAuthToken } from '@/lib/auth';
import api from '@/lib/api';
import { getIsoDateTimeWithActualTimeZone, isTimeLessThanNMinutes } from '@/lib/helpers';
import { useWindowSize } from '@/hooks/useWIndowSize';
import { basicRevealWithDelay, bottomMobileReveal } from '@/ui/animations/motion/reveals';
import PlusSign from '@/ui/svg/plus-sign.svg';
import ArrowRight from '@/ui/svg/arrow-right.svg';
import BackArrow from '@/ui/svg/arrow-prev.svg';
import { BREAKPOINTS } from '@/ui/settings';

const FishbowlList = () => {
  const [selectedFishbowl, setSelectedFishbowl] = useState<Fishbowl>(null);
  const [fishbowls, setFishbowls] = useState<Fishbowl[]>(null);
  const { width: windowWidth } = useWindowSize();
  const { t, lang } = useTranslation('fishbowl-list');
  const router = useRouter();

  const handleClick = (fishbowl: Fishbowl) => {
    setSelectedFishbowl(fishbowl);
  };

  const params = new URLSearchParams([
    ['finishDateTime[after]', getIsoDateTimeWithActualTimeZone()]
  ]);

  const getFishbowls = async () => {
    const auth = await getAuthToken();

    api
      .get(`/fishbowls`, {
        headers: {
          authorization: `${auth ? auth.authorizationString : null}`
        },
        params
      })
      .then(response => {
        setFishbowls(response.data);
      })
      .catch(error => {
        console.error('[STOOA] Fishbowl list error', error);
        router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
      });
  };

  const handleUpdateFishbowl = updatedFishbowl => {
    setFishbowls(currentFishbowls => {
      return currentFishbowls.map(fishbowl => {
        if (fishbowl.id !== updatedFishbowl.id) {
          return fishbowl;
        } else {
          return { ...fishbowl, ...updatedFishbowl };
        }
      });
    });
  };

  useEffect(() => {
    getFishbowls();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!fishbowls) {
    return <LoadingIcon />;
  } else {
    return (
      <FishbowlListWrapper>
        <Header>
          <div>
            <h1 className="fishbowl-list__title" data-testid="scheduled-header">
              <Trans
                i18nKey="fishbowl-list:scheduledFishbowls"
                components={{ i: <i />, span: <span data-testid="count" /> }}
                values={{
                  count: fishbowls.length
                }}
              />
            </h1>
            <RedirectLink href={ROUTE_FISHBOWL_CREATE} locale={lang} passHref>
              <ButtonSmall
                className="schedule-fishbowl secondary"
                onClick={() => {
                  pushEventDataLayer({
                    category: 'Schedule Fishbowl',
                    action: 'Fishbowl List',
                    label: window.location.href
                  });
                }}
              >
                <span>{t('common:scheduleFishbowl')}</span>
                <PlusSign />
              </ButtonSmall>
            </RedirectLink>
          </div>
          <span className="divider" />
        </Header>
        <FishbowlListContent>
          {fishbowls.length === 0 ? (
            <EmptyFishbowlList data-testid="empty-list">
              <div className="fishbowl-list__empty-illustration">
                {/* // eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="multi"
                  src="/img/fishbowl-list/empty-chairs-table.png"
                  alt="Empty chairs with table"
                />
                <img
                  className="single"
                  src="/img/fishbowl-list/empty-chair.png"
                  alt="Empty chair"
                />
              </div>
              <h2>
                <Trans i18nKey="fishbowl-list:emptyListTitle" components={{ i: <i /> }} />
              </h2>
              <p>
                <Trans i18nKey="fishbowl-list:emptyListDescription" components={{ i: <i /> }} />
              </p>
              <div className="empty-actions">
                <Link href={ROUTE_FISHBOWL_HOST_NOW} passHref>
                  <ButtonStyledLink
                    className="animate-item cta-create-fishbowl"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Host Fishbowl Now',
                        action: 'Empty Fishbowl List',
                        label: 'Fishbowl List'
                      });
                    }}
                  >
                    <span>{t('common:hostFishbowlNow')}</span>
                    <ArrowRight />
                  </ButtonStyledLink>
                </Link>
                <Link href={ROUTE_FISHBOWL_CREATE} passHref>
                  <ButtonStyledLink
                    className="animate-item cta-create-fishbowl secondary"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Schedule Fishbowl',
                        action: 'Empty Fishbowl List',
                        label: 'Fishbowl List'
                      });
                    }}
                  >
                    <span>{t('common:scheduleFishbowl')}</span>
                    <ArrowRight />
                  </ButtonStyledLink>
                </Link>
              </div>
            </EmptyFishbowlList>
          ) : (
            <>
              <FishbowlScrollList data-testid="fishbowl-list-wrapper">
                {fishbowls.map((fishbowl, index) => (
                  <FishbowlCard
                    onClick={fishbowl => handleClick(fishbowl)}
                    key={index}
                    fishbowl={fishbowl}
                    selected={fishbowl.id === selectedFishbowl?.id}
                  />
                ))}
              </FishbowlScrollList>
              <AnimatePresence>
                {selectedFishbowl &&
                  (!isTimeLessThanNMinutes(selectedFishbowl.startDateTimeTz, 30) ? (
                    <EditFormWrapper
                      as={motion.div}
                      variants={basicRevealWithDelay}
                      initial="initial"
                      exit="exit"
                      animate="visible"
                    >
                      <motion.div
                        className="form-wrapper"
                        variants={
                          windowWidth <= BREAKPOINTS.desktop
                            ? bottomMobileReveal
                            : basicRevealWithDelay
                        }
                        initial="initial"
                        exit="exit"
                        animate="visible"
                      >
                        <div className="form-header">
                          <MobileBackButton
                            className="bottom"
                            onClick={() => setSelectedFishbowl(null)}
                          >
                            <BackArrow />
                          </MobileBackButton>
                          <h2 className="title-md">
                            <Trans i18nKey="fishbowl-list:titleEdit" components={{ i: <i /> }} />
                          </h2>
                        </div>
                        <FishbowlForm
                          $isFull={windowWidth <= BREAKPOINTS.desktop}
                          selectedFishbowl={selectedFishbowl}
                          isEditForm={true}
                          onSaveCallback={handleUpdateFishbowl}
                        />
                      </motion.div>
                    </EditFormWrapper>
                  ) : (
                    <DetailPlaceholder
                      data-testid="started-fishbowl-placeholder"
                      as={motion.div}
                      variants={
                        windowWidth <= BREAKPOINTS.desktop
                          ? bottomMobileReveal
                          : basicRevealWithDelay
                      }
                      initial="initial"
                      exit="exit"
                      animate="visible"
                    >
                      <h2>
                        <Trans i18nKey="fishbowl-list:fishbowlStarted" components={{ i: <i /> }} />
                      </h2>
                      <p>
                        <Trans
                          i18nKey="fishbowl-list:fishbowlStartedDescription"
                          components={{ i: <i /> }}
                        />
                      </p>
                      <RedirectLink
                        href={`${ROUTE_FISHBOWL}/${selectedFishbowl.slug}`}
                        locale={selectedFishbowl.locale}
                        passHref
                      >
                        <ButtonStyledLink
                          className="enter-fishbowl"
                          data-testid="started-enter-fishbowl"
                        >
                          <span>{t('enterFishbowl')}</span>
                          <ArrowRight />
                        </ButtonStyledLink>
                      </RedirectLink>
                      <ButtonLinkColored className="back" onClick={() => setSelectedFishbowl(null)}>
                        <span>{t('back')}</span>
                      </ButtonLinkColored>
                    </DetailPlaceholder>
                  ))}
              </AnimatePresence>
              {!selectedFishbowl && (
                <DetailPlaceholder data-testid="selected-placeholder" className="not-selected">
                  <h2>
                    <Trans
                      i18nKey="fishbowl-list:noSelectedFishbowlTitle"
                      components={{ i: <i /> }}
                    />
                  </h2>
                  <p>
                    <Trans
                      i18nKey="fishbowl-list:noSelectedFishbowlDescription"
                      components={{ i: <i /> }}
                    />
                  </p>
                </DetailPlaceholder>
              )}
            </>
          )}
        </FishbowlListContent>
      </FishbowlListWrapper>
    );
  }
};

export default FishbowlList;
