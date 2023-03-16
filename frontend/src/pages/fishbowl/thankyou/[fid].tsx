/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';

import {
  ROUTE_FISHBOWL_CREATE,
  ROUTE_NOT_FOUND,
  ROUTE_HOME,
  ROUTE_FISHBOWL_FINISHED
} from '@/app.config';
import { dataLayerPush, pushEventDataLayer } from '@/lib/analytics';
import { GET_FISHBOWL, IS_FISHBOWL_CREATOR } from '@/lib/gql/Fishbowl';
import { formatDateTime } from '@/lib/helpers';
import userRepository from '@/jitsi/User';
import ThankYouStyled, { Description, Time, StyledThankyouWrapper } from '@/ui/pages/thank-you';
import Linkedin from '@/ui/svg/share-linkedin.svg';
import Mail from '@/ui/svg/share-mail.svg';
import Twitter from '@/ui/svg/share-twitter.svg';
import Whatsapp from '@/ui/svg/share-whatsapp.svg';
import RedirectLink from '@/components/Web/RedirectLink';
import Button from '@/components/Common/Button';
import FeedbackForm from '@/components/App/FeedbackForm';
import Trans from 'next-translate/Trans';

const Layout = dynamic(import('@/layouts/Default'), { loading: () => <div /> });
const Loader = dynamic(import('@/components/Web/Loader'), { loading: () => <div /> });
const Error = dynamic(import('@/components/Common/Error'), { loading: () => <div /> });

const ThankYou = () => {
  const { t, lang } = useTranslation('fishbowl');

  const router = useRouter();
  const {
    query: { fid }
  } = router;

  const userFeedback = userRepository.getUserFeedback();
  const userHasParticipated = userRepository.getUserParticipantSlug() === (fid as string);
  const thankYouFeedbackGiven =
    userFeedback.feedbackFishbowlSlug === (fid as string) && userFeedback.fromThankYou;

  const { loading: creatorLoading, data: fbCreatorData } = useQuery(IS_FISHBOWL_CREATOR, {
    variables: { slug: fid }
  });

  const { loading, error, data } = useQuery(GET_FISHBOWL, { variables: { slug: fid } });

  if (loading || creatorLoading) return <Loader />;
  if (error) return <Error message={error?.message} />;

  const { bySlugQueryFishbowl: fb } = data;

  if (!fb) {
    router.push(ROUTE_NOT_FOUND, ROUTE_NOT_FOUND, { locale: lang });
    return <Loader />;
  }

  const startDate = formatDateTime(fb.startDateTimeTz);
  const endDate = formatDateTime(fb.endDateTimeTz);
  const isModerator = !!fbCreatorData && !!fbCreatorData.isCreatorOfFishbowl;
  const showFeedbackForm = userHasParticipated && !thankYouFeedbackGiven && !isModerator;

  dataLayerPush({
    event: 'GAPageView',
    pageViewUrl: `/thank-you/${fid}`,
    pageViewTitle: `Thank you page ${fid}`
  });

  const shareTitle = `Stooa: ${t('home:title')}`;

  return (
    <Layout title={fb.name} decorated>
      <StyledThankyouWrapper>
        <Time
          as="time"
          dateTime={`${startDate.date} ${startDate.time} - ${endDate.time}`}
          className="error"
        >
          <p data-testid="finished-fishbowl" className="body-md medium">
            {t('finishedEvent')}
          </p>
          <div className="body-sm">
            {`${t(`months.${startDate.month}`)} ${startDate.day}, ${startDate.year}. ${
              startDate.time
            } - ${endDate.time} ${endDate.timezone}`}
          </div>
        </Time>
        {(!fb.isPrivate || fb.plainPassword) && (
          <>
            <h1 className="body-lg medium">{fb.name}</h1>
            {fb.description && <Description className="body-sm">{fb.description}</Description>}
          </>
        )}
        {showFeedbackForm && (
          <FeedbackForm fishbowl={data.bySlugQueryFishbowl} variant="thankyou" />
        )}

        <ThankYouStyled>
          {(!fb.isPrivate || fb.plainPassword) && (
            <div className="share body-md medium">
              <p>{t('share')}</p>
              <ul>
                <li>
                  <Link
                    href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_APP_DOMAIN}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Share',
                        action: 'Whastapp',
                        label: `fishbowl/thankyou/${fid}`
                      });
                    }}
                  >
                    <Whatsapp />
                  </Link>
                </li>
                <li>
                  <Link
                    href={`https://www.linkedin.com/shareArticle?url=${process.env.NEXT_PUBLIC_APP_DOMAIN}&title=${shareTitle}&mini=true`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Share',
                        action: 'Linkedin',
                        label: `fishbowl/thankyou/${fid}`
                      });
                    }}
                  >
                    <Linkedin />
                  </Link>
                </li>
                <li>
                  <Link
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${process.env.NEXT_PUBLIC_APP_DOMAIN}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Share',
                        action: 'Twitter',
                        label: `fishbowl/thankyou/${fid}`
                      });
                    }}
                  >
                    <Twitter />
                  </Link>
                </li>
                <li>
                  <Link
                    href={`mailto:?subject=${shareTitle}&body=${process.env.NEXT_PUBLIC_APP_DOMAIN}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Share',
                        action: 'Mail',
                        label: `fishbowl/thankyou/${fid}`
                      });
                    }}
                  >
                    <Mail />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className="action-wrapper">
            {isModerator ? (
              <div>
                <h2 className="past-title body-md medium">
                  <Trans i18nKey="common:goToFinishedFishbowlsTitle" components={{ i: <i /> }} />
                </h2>
                <Link href={`${ROUTE_FISHBOWL_FINISHED}?selected=${fid}`} legacyBehavior passHref>
                  <Button
                    size="large"
                    as="a"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Schedule Fishbowl',
                        action: 'Thank You Page',
                        label: `fishbowl/thankyou/${fid}`
                      });
                    }}
                  >
                    {t('common:goToFinishedFishbowls')}
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <RedirectLink href={ROUTE_FISHBOWL_CREATE} passHref>
                  <Button
                    size="large"
                    as="a"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Schedule Fishbowl',
                        action: 'Thank You Page',
                        label: `fishbowl/thankyou/${fid}`
                      });
                    }}
                  >
                    <span>{t('common:scheduleFishbowl')}</span>
                  </Button>
                </RedirectLink>
                <RedirectLink href={ROUTE_HOME} passHref>
                  <Button size="large" variant="secondary" as="a">
                    <span>{t('common:goHome')}</span>
                  </Button>
                </RedirectLink>
              </>
            )}
          </div>
        </ThankYouStyled>
      </StyledThankyouWrapper>
    </Layout>
  );
};

export default ThankYou;
