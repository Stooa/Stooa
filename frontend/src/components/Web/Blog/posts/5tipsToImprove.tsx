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
        <p>{t('posts.5-tips-boost-participation-online-meetings.content.firstBlock')}</p>
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.secondBlock"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
        <p>{t('posts.5-tips-boost-participation-online-meetings.content.thirdBlock')}</p>
      </section>
      <section id="ice-breakers">
        <h2>{t('posts.5-tips-boost-participation-online-meetings.content.icebreakers')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.fourthBlock"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
        <p>{t('posts.5-tips-boost-participation-online-meetings.content.fifthBlock')}</p>
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
        <h2>{t('posts.5-tips-boost-participation-online-meetings.content.surveys')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.sixthBlock"
            components={{
              br: <br />,
              span: <span className="medium" />
            }}
          />
        </p>
        <p>{t('posts.5-tips-boost-participation-online-meetings.content.seventhBlock')}</p>
      </section>
      <section id="agenda">
        <h2>{t('posts.5-tips-boost-participation-online-meetings.content.agenda')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.eighthBlock"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
      </section>
      <section id="reactions">
        <h2>{t('posts.5-tips-boost-participation-online-meetings.content.reactions')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.ninthBlock"
            components={{ br: <br />, span: <span className="medium" /> }}
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
        <h2>{t('posts.5-tips-boost-participation-online-meetings.content.fishbowl')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.eleventhBlock"
            components={{ span: <span className="medium" /> }}
          />
        </p>
        <h3>{t('posts.5-tips-boost-participation-online-meetings.content.howItWorks')}</h3>
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.twelfthBlock"
            components={{ span: <span className="medium" /> }}
          />
        </p>
        <h3>{t('posts.5-tips-boost-participation-online-meetings.content.benefits')}</h3>
        <ol>
          <li>
            <Trans
              i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.listItem1"
              components={{ span: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.listItem2"
              components={{ span: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.listItem3"
              components={{ span: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.listItem4"
              components={{ span: <span className="medium" /> }}
            />
          </li>
        </ol>
        <p>{t('posts.5-tips-boost-participation-online-meetings.content.thirdteenthBlock')}</p>
        <div className="schedule-cta centered">
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
        <h2>{t('posts.5-tips-boost-participation-online-meetings.content.summaryTitle')}</h2>
        <p>{t('posts.5-tips-boost-participation-online-meetings.content.fourteenthBlock')}</p>
        <Trans
          i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.sixteenthBlock"
          components={{ span: <span className="medium" /> }}
        />
      </section>
      <p>
        <Trans
          i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.seventeenthBlock"
          components={{
            br: <br />
          }}
        />
      </p>
      <div className="article-reference">
        <p>
          <Trans
            i18nKey="blog:posts.5-tips-boost-participation-online-meetings.content.readTheArticle"
            components={{
              a: (
                <a
                  href="https://www.linkedin.com/pulse/5-consejos-para-impulsar-la-participaci%2525C3%2525B3n-en-online-carme-alcoverro-q26tf%3FtrackingId=%252FFIJXGpjTmWCtT710CA%252BYw%253D%253D/?trackingId=%2FFIJXGpjTmWCtT710CA%2BYw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                />
              )
            }}
          />
        </p>
      </div>
      <section></section>
    </>
  );
};
