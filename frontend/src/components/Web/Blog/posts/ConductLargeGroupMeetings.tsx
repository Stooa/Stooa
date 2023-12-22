/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ROUTE_BLOG, ROUTE_HOME } from '@/app.config';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';

export const ConductLargeGroupMeetings = () => {
  const { t } = useTranslation('blog');
  return (
    <>
      <section>
        <p>{t('posts.conduct-large-group-online-meetings.content.introBlock')}</p>
        <p>
          <Trans
            i18nKey="blog:posts.conduct-large-group-online-meetings.content.introBlock2"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/conduct/women-meeting.jpg"
          fill
          alt="An old photo of women doing a meeting."
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      <section id="about-stooa">
        <p>
          <Trans
            i18nKey="blog:posts.conduct-large-group-online-meetings.content.aboutStooa"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
        <p>
          <Trans
            i18nKey="blog:posts.conduct-large-group-online-meetings.content.largeWithStooa"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
      </section>
      <section id="preparation">
        <h2>{t('posts.conduct-large-group-online-meetings.content.preparation')}</h2>
        <ul>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.chooseItem"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.dayItem"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
        </ul>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/conduct/woman-fishbowl.jpg"
          fill
          alt="A woman fishing in a fishbowl."
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      <section id="the-day">
        <h2>{t('posts.conduct-large-group-online-meetings.content.theDay')}</h2>
        <ul>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.metodology"
              components={{
                br: <br />,
                span: <span className="medium" />,
                a: <Link href={ROUTE_HOME} target="_blank" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.moderationitem"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
        </ul>
      </section>
      <section id="participation">
        <h2>{t('posts.conduct-large-group-online-meetings.content.makeThemParticipate')}</h2>
        <ul>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.icebreakersItems"
              components={{
                span: <span className="medium" />,
                a: (
                  <Link
                    href={`${ROUTE_BLOG}/5-tips-boost-participation-online-meetings`}
                    target="_blank"
                  />
                )
              }}
            />
          </li>
        </ul>
      </section>

      <section id="active-management">
        <h2>{t('posts.conduct-large-group-online-meetings.content.activeManagement')}</h2>
        <ul>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.timeForEveryoneItem"
              components={{ span: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.closingItem"
              components={{ span: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.conduct-large-group-online-meetings.content.feedbackItem"
              components={{ span: <span className="medium" /> }}
            />
          </li>
        </ul>
      </section>

      <section id="summary">
        <h2>{t('posts.conduct-large-group-online-meetings.content.inSummary')}</h2>
        <p>{t('posts.conduct-large-group-online-meetings.content.inSummaryText')}</p>
      </section>
    </>
  );
};
