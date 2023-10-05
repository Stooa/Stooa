/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ROUTE_FISHBOWL_CREATE,
  ROUTE_FISHBOWL_FINISHED,
  ROUTE_FISHBOWL_SCHEDULED,
  ROUTE_HOME
} from '@/app.config';
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
import { basicRevealWithDelay, bottomMobileReveal } from '@/ui/animations/motion/reveals';
import PlusSign from '@/ui/svg/plus-sign.svg';
import BackArrow from '@/ui/svg/arrow-prev.svg';
import DetailPlaceholder from './DetailPlaceholder';
import EmptyFishbowlList from './EmptyFishbowlList';
import Link from 'next/link';
import { FishbowlDashboardData } from './FishbowlDashboardData';
import { useNavigatorType } from '@/hooks/useNavigatorType';

interface Props {
  selectedFishbowlParam?: string;
  isPastList: boolean;
}

const FishbowlList: React.FC<Props> = ({ selectedFishbowlParam, isPastList }) => {
  const [selectedFishbowl, setSelectedFishbowl] = useState<Fishbowl>();
  const [paginator, setPaginator] = useState<number>(1);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false);
  const [fishbowls, setFishbowls] = useState<Fishbowl[]>();
  const [fishbowlPastCount, setFishbowlPastCount] = useState<number>(0);
  const [fishbowlFutureCount, setFishbowlFutureCount] = useState<number>(0);
  const { deviceType } = useNavigatorType();
  const { t, lang } = useTranslation('fishbowl-list');
  const router = useRouter();

  const handleClick = (fishbowl: Fishbowl) => {
    setSelectedFishbowl(fishbowl);
  };

  const getFutureParams = (pageNumber: string) => {
    return new URLSearchParams([
      ['startDateTime[after]', getFiveHoursAgoDate()],
      ['finishDateTime[after]', getIsoDateTimeWithActualTimeZone()],
      ['currentStatus[0]', 'not_started'],
      ['currentStatus[1]', 'introduction'],
      ['currentStatus[2]', 'running'],
      ['order[startDateTime]', 'asc'],
      ['page', pageNumber]
    ]);
  };

  const getPastParams = (pageNumber: string) => {
    return new URLSearchParams([
      ['or[startDateTime][before]', getFiveHoursAgoDate()],
      ['or[currentStatus]', 'finished'],
      ['order[startDateTime]', 'desc'],
      ['page', pageNumber]
    ]);
  };

  const getApiFishbowls = async (params: URLSearchParams) => {
    const auth = await getAuthToken();
    return api
      .get(`/fishbowls`, {
        headers: {
          Accept: 'application/ld+json',
          authorization: `${auth ? auth.authorizationString : null}`
        },
        params
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('[STOOA] Fishbowl list error', error);
        router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
      });
  };

  const getFishbowls = useCallback(async () => {
    const pastParams = getPastParams('1');
    getApiFishbowls(pastParams).then(data => {
      setFishbowlPastCount(data['hydra:totalItems']);
      if (isPastList) {
        if (data['hydra:member']) {
          setFishbowls(data['hydra:member']);
          setLoadMoreDisabled(data['hydra:view']['hydra:next'] === undefined);
        }
      }
    });

    const futureParams = getFutureParams('1');
    getApiFishbowls(futureParams).then(data => {
      setFishbowlFutureCount(data['hydra:totalItems']);
      if (!isPastList) {
        if (data['hydra:member']) {
          setFishbowls(data['hydra:member']);
          setLoadMoreDisabled(data['hydra:view']['hydra:next'] === undefined);
        }
      }
    });
  }, [lang, router]);

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

  const loadMore = () => {
    const newPaginator = paginator + 1;
    const params = isPastList
      ? getPastParams(newPaginator.toString())
      : getFutureParams(newPaginator.toString());

    getApiFishbowls(params).then(data => {
      if (data['hydra:member']) {
        if (fishbowls) {
          const mergedFishbowls = [...fishbowls, ...data['hydra:member']];
          setFishbowls(mergedFishbowls);
          setPaginator(newPaginator);
          setLoadMoreDisabled(data['hydra:view']['hydra:next'] === undefined);
        }
      }
    });
  };

  useEffect(() => {
    getFishbowls();
  }, [getFishbowls]);

  useEffect(() => {
    if (fishbowls && isPastList) {
      if (deviceType && deviceType !== 'Mobile') {
        setSelectedFishbowl(fishbowls[0]);
      }

      fishbowls.forEach(fishbowl => {
        if (fishbowl.slug === selectedFishbowlParam) {
          setSelectedFishbowl(fishbowl);
        }
      });
    }
  }, [fishbowls]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!fishbowls) {
    return <LoadingIcon />;
  } else {
    return (
      <FishbowlListWrapper>
        <StyledListHeader>
          <div className="header__wrapper">
            <div className="fishbowl-list__header">
              <Link
                className={`fishbowl-list__header-link fishbowl-list__scheduled-link ${
                  !isPastList ? 'medium' : ''
                }`}
                data-testid="scheduled-fishbowls-header"
                href={ROUTE_FISHBOWL_SCHEDULED}
              >
                <Trans
                  i18nKey="fishbowl-list:scheduledFishbowls"
                  components={{ i: <i />, span: <span data-testid="count" /> }}
                  values={{
                    count: fishbowlFutureCount
                  }}
                />
              </Link>

              <Link
                className={`fishbowl-list__header-link fishbowl-list__finished-link ${
                  isPastList ? 'medium' : ''
                }`}
                data-testid="finished-fishbowls-header"
                href={ROUTE_FISHBOWL_FINISHED}
              >
                <Trans
                  i18nKey="fishbowl-list:finishedFishbowls"
                  components={{ i: <i />, span: <span data-testid="count" /> }}
                  values={{
                    count: fishbowlPastCount
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
            <EmptyFishbowlList isPastList={isPastList} />
          ) : (
            <>
              <FishbowlScrollList data-testid="fishbowl-list-wrapper">
                {isPastList
                  ? fishbowls.map(fishbowl => {
                      return (
                        <FinishedFishbowlCard
                          onClick={fishbowl => handleClick(fishbowl)}
                          key={fishbowl.id}
                          fishbowl={fishbowl}
                          selected={fishbowl.id === selectedFishbowl?.id}
                        />
                      );
                    })
                  : fishbowls.map(fishbowl => (
                      <FishbowlCard
                        onClick={fishbowl => handleClick(fishbowl)}
                        key={fishbowl.id}
                        fishbowl={fishbowl}
                        selected={fishbowl.id === selectedFishbowl?.id}
                      />
                    ))}
                <Button
                  variant="link"
                  className="sticky-button"
                  onClick={() => loadMore()}
                  disabled={loadMoreDisabled}
                >
                  {t('fishbowl-list:loadMore')}
                </Button>
              </FishbowlScrollList>

              <AnimatePresence>
                {selectedFishbowl &&
                  !isPastList &&
                  !isTimeLessThanNMinutes(selectedFishbowl.startDateTimeTz, 30) && (
                    <EditFormWrapper
                      key="edit-form"
                      as={motion.div}
                      variants={basicRevealWithDelay}
                      initial="initial"
                      exit="exit"
                      animate="visible"
                    >
                      <motion.div
                        className="form-wrapper"
                        variants={
                          deviceType === 'Mobile' ? bottomMobileReveal : basicRevealWithDelay
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
                          isFull={true}
                          selectedFishbowl={selectedFishbowl}
                          isEditForm={true}
                          onSaveCallback={handleUpdateFishbowl}
                        />
                      </motion.div>
                    </EditFormWrapper>
                  )}

                {selectedFishbowl &&
                  !isPastList &&
                  isTimeLessThanNMinutes(selectedFishbowl.startDateTimeTz, 30) && (
                    <EditFormWrapper
                      key="edit-form"
                      as={motion.div}
                      variants={basicRevealWithDelay}
                      initial="initial"
                      exit="exit"
                      animate="visible"
                    >
                      <DetailPlaceholder
                        selectedFishbowl={selectedFishbowl}
                        onClickBack={() => setSelectedFishbowl(undefined)}
                      />
                    </EditFormWrapper>
                  )}

                {!selectedFishbowl && !isPastList && deviceType === 'Desktop' && (
                  <EditFormWrapper
                    key="edit-form"
                    as={motion.div}
                    variants={basicRevealWithDelay}
                    initial="initial"
                    exit="exit"
                    animate="visible"
                  >
                    <DetailPlaceholder
                      selectedFishbowl={selectedFishbowl}
                      onClickBack={() => setSelectedFishbowl(undefined)}
                    />
                  </EditFormWrapper>
                )}

                {selectedFishbowl && isPastList && (
                  <EditFormWrapper
                    key="edit-form"
                    as={motion.div}
                    variants={basicRevealWithDelay}
                    initial="initial"
                    exit="exit"
                    animate="visible"
                  >
                    <FishbowlDashboardData
                      variants={deviceType === 'Mobile' ? bottomMobileReveal : undefined}
                      onClickBack={() => setSelectedFishbowl(undefined)}
                      fishbowl={selectedFishbowl}
                    />
                  </EditFormWrapper>
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
