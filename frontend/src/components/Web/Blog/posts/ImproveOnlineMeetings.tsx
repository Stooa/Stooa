/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import RedirectLink from '../../RedirectLink';
import { ROUTE_FISHBOWL_CREATE } from '@/app.config';
import Button from '@/components/Common/Button';
import { pushEventDataLayer } from '@/lib/analytics';

export const ImproveOnlineMeetings = () => {
  const { t } = useTranslation('blog');
  return (
    <>
      <section>
        <p>{t('posts.improve-online-meetings.content.firstBlock')}</p>
        <p>{t('posts.improve-online-meetings.content.secondBlock')}</p>
        <p>{t('posts.improve-online-meetings.content.thirdBlock')}</p>
      </section>
      <section id="ice-breakers">
        <h2>{t('posts.improve-online-meetings.content.icebreakers')}</h2>
        <p>{t('posts.improve-online-meetings.content.fourthBlock')}</p>
        <p>{t('posts.improve-online-meetings.content.fifthBlock')}</p>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/improve/blog-1.png"
          fill
          alt="Woman loading ice into a an old car."
          objectFit="contain"
          objectPosition="top"
        />
      </div>
      <section id="surveys">
        <h2>{t('posts.improve-online-meetings.content.surveys')}</h2>
        <p>{t('posts.improve-online-meetings.content.sixthBlock')}</p>
        <p>{t('posts.improve-online-meetings.content.seventhBlock')}</p>
      </section>
      <section id="agenda">
        <h2>{t('posts.improve-online-meetings.content.agenda')}</h2>
        <p>{t('posts.improve-online-meetings.content.eighthBlock')}</p>
      </section>
      <section id="reactions">
        <h2>{t('posts.improve-online-meetings.content.reactions')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.improve-online-meetings.content.ninthBlock"
            components={{ br: <br /> }}
          />
        </p>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/improve/blog-2.png"
          fill
          alt="People laughing in a cinema"
          objectFit="contain"
          objectPosition="top"
        />
      </div>
      <section id="fishbowl">
        <h2>{t('posts.improve-online-meetings.content.fishbowl')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.improve-online-meetings.content.eleventhBlock"
            components={{ 1: <span className="medium" /> }}
          />
        </p>
        <h3>{t('posts.improve-online-meetings.content.howItWorks')}</h3>
        <p>{t('posts.improve-online-meetings.content.twelfthBlock')}</p>
        <h3>{t('posts.improve-online-meetings.content.benefits')}</h3>
        <ol>
          <li>
            <Trans
              i18nKey="blog:posts.improve-online-meetings.content.listItem1"
              components={{ 1: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.improve-online-meetings.content.listItem2"
              components={{ 1: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.improve-online-meetings.content.listItem3"
              components={{ 1: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.improve-online-meetings.content.listItem4"
              components={{ 1: <span className="medium" /> }}
            />
          </li>
        </ol>
        <p>{t('posts.improve-online-meetings.content.thirdteenthBlock')}</p>
        <div className="schedule-cta">
          <RedirectLink href={ROUTE_FISHBOWL_CREATE} passHref>
            <Button
              size="large"
              as="a"
              className="animate-item cta-create-fishbowl "
              onClick={() => {
                pushEventDataLayer({
                  category: 'Schedule Fishbowl',
                  action: 'Improve online meetings',
                  label: 'Blog'
                });
              }}
            >
              <span>{t('blogCTA')}</span>
            </Button>
          </RedirectLink>
        </div>
      </section>
      <section>
        <h2>{t('posts.improve-online-meetings.content.summaryTitle')}</h2>
        <p>{t('posts.improve-online-meetings.content.fourteenthBlock')}</p>
        <p>{t('posts.improve-online-meetings.content.sixteenthBlock')}</p>
      </section>
      <p>
        <Trans
          i18nKey="blog:posts.improve-online-meetings.content.seventeenthBlock"
          components={{
            br: <br />
          }}
        />
      </p>
      <div className="article-reference">
        <p>
          <Trans
            i18nKey="blog:posts.improve-online-meetings.content.readTheArticle"
            components={{
              a: <a href="https://linkedin.com" target="_blank" rel="noreferrer" />
            }}
          />
        </p>
      </div>
      <section></section>
    </>
  );
};