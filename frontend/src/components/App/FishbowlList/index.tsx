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
import { ROUTE_FISHBOWL_CREATE, ROUTE_FISHBOWL_HOST_NOW, ROUTE_HOME } from '@/app.config';

import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';
import { pushEventDataLayer } from '@/lib/analytics';

import RedirectLink from '@/components/Web/RedirectLink';
import LoadingIcon from '@/components/Common/LoadingIcon';
import { ButtonSmall, ButtonStyledLink } from '@/ui/Button';
import FishbowlCard from '@/components/App/FishbowlList/FishbowlCard';
import {
  EmptyFishbowlList,
  FishbowlListWrapper,
  FishbowlScrollList,
  Header,
  FishbowlListContent,
  EditFormWrapper
} from '@/components/App/FishbowlList/styles';

import PlusSign from '@/ui/svg/plus-sign.svg';
import ArrowRight from '@/ui/svg/arrow-right.svg';
import { getAuthToken } from '@/lib/auth';
import api from '@/lib/api';
import { getIsoDateTimeWithActualTimeZone, isTimeLessThanNMinutes } from '@/lib/helpers';
import FishbowlForm from '@/components/Web/Forms/FishbowlForm';

const FishbowlList = () => {
  const [selectedFishbowl, setSelectedFishbowl] = useState<Fishbowl>(null);
  const [fishbowls, setFishbowls] = useState<Fishbowl[]>(null);
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
    setFishbowls(fishbowls => {
      return fishbowls.map(fishbowl => {
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
            <h1 className="fishbowl-list__title" data-cy="scheduled-header">
              <Trans
                i18nKey="fishbowl-list:scheduledFishbowls"
                components={{ i: <i />, span: <span data-cy="count" /> }}
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
        <FishbowlListContent className={`${selectedFishbowl && 'half'}`}>
          {fishbowls.length === 0 ? (
            <EmptyFishbowlList data-cy="empty-list">
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
              <FishbowlScrollList>
                {fishbowls.map((fishbowl, index) => (
                  <FishbowlCard
                    onClick={fishbowl => handleClick(fishbowl)}
                    key={index}
                    fishbowl={fishbowl}
                    selected={fishbowl.id === selectedFishbowl?.id}
                  />
                ))}
              </FishbowlScrollList>
              {selectedFishbowl && (
                <EditFormWrapper>
                  <h2 className="title-md">{t('titleEdit')}</h2>
                  <FishbowlForm
                    selectedFishbowl={selectedFishbowl}
                    isEditForm={true}
                    onSaveCallback={handleUpdateFishbowl}
                  />
                </EditFormWrapper>
              )}
            </>
          )}
        </FishbowlListContent>
      </FishbowlListWrapper>
    );
  }
};

export default FishbowlList;
