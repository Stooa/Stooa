/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { motion, AnimatePresence } from 'framer-motion';

import { ROUTE_FISHBOWL_CREATE, ROUTE_HOME } from '@/app.config';
import { Fishbowl } from '@/types/api-platform';
import { pushEventDataLayer } from '@/lib/analytics';

import RedirectLink from '@/components/Web/RedirectLink';
import LoadingIcon from '@/components/Common/LoadingIcon';
import FishbowlCard from '@/user/FishbowlList/FishbowlCard';
import FinishedFishbowlCard from './FinishedFishbowlCard';
import {
  FishbowlListWrapper,
  FishbowlScrollList,
  StyledListHeader,
  FishbowlListContent,
  EditFormWrapper,
  MobileBackButton
} from '@/user/FishbowlList/styles';
import FishbowlForm from '@/components/Web/Forms/FishbowlForm';
import Button from '@/components/Common/Button';

import { getAuthToken } from '@/user/auth';
import api from '@/lib/api';
import {
  getFiveHoursAgoDate,
  getIsoDateTimeWithActualTimeZone,
  isTimeLessThanNMinutes
} from '@/lib/helpers';
import { useWindowSize } from '@/hooks/useWIndowSize';
import { basicRevealWithDelay, bottomMobileReveal } from '@/ui/animations/motion/reveals';
import PlusSign from '@/ui/svg/plus-sign.svg';
import BackArrow from '@/ui/svg/arrow-prev.svg';
import { BREAKPOINTS } from '@/ui/settings';
import DetailPlaceholder from './DetailPlaceholder';
import EmptyFishbowlList from './EmptyFishbowlList';
import Link from 'next/link';

interface Props {
  selectedFishbowlParam?: string;
  isPastList: boolean;
}

const FishbowlList: React.FC<Props> = ({ selectedFishbowlParam, isPastList }) => {
  const [selectedFishbowl, setSelectedFishbowl] = useState<Fishbowl>();
  const [shouldShowEditForm, setShouldShowEditForm] = useState(false);
  const [fishbowls, setFishbowls] = useState<Fishbowl[]>();
  const { width: windowWidth } = useWindowSize();
  const { t, lang } = useTranslation('fishbowl-list');
  const router = useRouter();
  const handleClick = (fishbowl: Fishbowl) => {
    setSelectedFishbowl(fishbowl);
  };

  const futureParams = useMemo(
    () =>
      new URLSearchParams([
        ['startDateTime[after]', getFiveHoursAgoDate()],
        ['finishDateTime[after]', getIsoDateTimeWithActualTimeZone()],
        ['currentStatus[0]', 'not_started'],
        ['currentStatus[1]', 'introduction'],
        ['currentStatus[2]', 'running']
      ]),
    []
  );

  const pastParams = useMemo(
    () =>
      new URLSearchParams([
        ['or[startDateTime][before]', getFiveHoursAgoDate()],
        ['or[currentStatus]', 'finished']
      ]),
    []
  );

  const params = useMemo(
    () => (isPastList ? pastParams : futureParams),
    [isPastList, pastParams, futureParams]
  );

  const getFishbowls = useCallback(async () => {
    const auth = await getAuthToken();
    api
      .get(`/fishbowls`, {
        headers: {
          authorization: `${auth ? auth.authorizationString : null}`
        },
        params
      })
      .then(response => {
        console.log('-------->', response);
        setFishbowls(response.data);
      })
      .catch(error => {
        console.error('[STOOA] Fishbowl list error', error);
        router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
      });
  }, [lang, router, params]);

  const handleUpdateFishbowl = updatedFishbowl => {
    setSelectedFishbowl(updatedFishbowl);
    setFishbowls(currentFishbowls => {
      if (currentFishbowls) {
        return currentFishbowls.map(fishbowl => {
          if (fishbowl.id !== updatedFishbowl.id) {
            return fishbowl;
          } else {
            return { ...fishbowl, ...updatedFishbowl };
          }
        });
      }
    });
  };

  useEffect(() => {
    getFishbowls();
  }, [getFishbowls]);

  useEffect(() => {
    if (fishbowls) {
      fishbowls.forEach(fishbowl => {
        if (fishbowl.slug === selectedFishbowlParam) {
          setSelectedFishbowl(fishbowl);
        }
      });
    }
  }, [fishbowls]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedFishbowl && !isTimeLessThanNMinutes(selectedFishbowl.startDateTimeTz, 30)) {
      setShouldShowEditForm(true);
    } else {
      setShouldShowEditForm(false);
    }
  }, [selectedFishbowl]);

  if (!fishbowls) {
    return <LoadingIcon />;
  } else {
    return (
      <FishbowlListWrapper>
        <StyledListHeader>
          <div className="header__wrapper">
            <div>
              <Link
                className={`fishbowl-list__header-link fishbowl-list__scheduled-link ${
                  !isPastList ? 'medium' : ''
                }`}
                data-testid="scheduled-header"
                href={'/fishbowl/future'}
              >
                <Trans
                  i18nKey="fishbowl-list:scheduledFishbowls"
                  components={{ i: <i />, span: <span data-testid="count" /> }}
                  values={{
                    count: fishbowls.length
                  }}
                />
              </Link>
              <Link
                className={`fishbowl-list__header-link fishbowl-list__finished-link ${
                  isPastList ? 'medium' : ''
                }`}
                data-testid="finished-fishbowls-header"
                href={'/fishbowl/past'}
              >
                <Trans
                  i18nKey="fishbowl-list:pastFishbowls"
                  components={{ i: <i />, span: <span data-testid="count" /> }}
                  values={{
                    count: fishbowls.length
                  }}
                />
              </Link>
            </div>
            <RedirectLink href={ROUTE_FISHBOWL_CREATE} locale={lang} passHref>
              <Button
                as="a"
                variant="secondary"
                className="schedule-fishbowl never-full"
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
              </Button>
            </RedirectLink>
          </div>
          <span className="divider" />
        </StyledListHeader>

        <FishbowlListContent className={fishbowls.length === 0 ? '' : 'not-empty'}>
          {fishbowls.length === 0 ? (
            <EmptyFishbowlList />
          ) : (
            <>
              <FishbowlScrollList data-testid="fishbowl-list-wrapper">
                {isPastList
                  ? fishbowls.map(fishbowl => (
                      <FinishedFishbowlCard
                        onClick={fishbowl => handleClick(fishbowl)}
                        key={fishbowl.id}
                        fishbowl={fishbowl}
                        selected={fishbowl.id === selectedFishbowl?.id}
                      />
                    ))
                  : fishbowls.map(fishbowl => (
                      <FishbowlCard
                        onClick={fishbowl => handleClick(fishbowl)}
                        key={fishbowl.id}
                        fishbowl={fishbowl}
                        selected={fishbowl.id === selectedFishbowl?.id}
                      />
                    ))}
              </FishbowlScrollList>
              <AnimatePresence>
                {selectedFishbowl !== undefined &&
                  (shouldShowEditForm ? (
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
                          windowWidth && windowWidth <= BREAKPOINTS.desktop
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
                            onClick={() => setSelectedFishbowl(undefined)}
                          >
                            <BackArrow />
                          </MobileBackButton>
                          <h2 className="title-md form-title">
                            <Trans i18nKey="fishbowl-list:titleEdit" components={{ i: <i /> }} />
                          </h2>
                        </div>
                        <FishbowlForm
                          $isFull={windowWidth !== undefined && windowWidth <= BREAKPOINTS.desktop}
                          selectedFishbowl={selectedFishbowl}
                          isEditForm={true}
                          onSaveCallback={handleUpdateFishbowl}
                        />
                      </motion.div>
                    </EditFormWrapper>
                  ) : (
                    <DetailPlaceholder
                      selectedFishbowl={selectedFishbowl}
                      onClickBack={() => setSelectedFishbowl(undefined)}
                    />
                  ))}

                {!selectedFishbowl && (
                  <DetailPlaceholder
                    selectedFishbowl={selectedFishbowl}
                    onClickBack={() => setSelectedFishbowl(undefined)}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </FishbowlListContent>
      </FishbowlListWrapper>
    );
  }
};

export default FishbowlList;
