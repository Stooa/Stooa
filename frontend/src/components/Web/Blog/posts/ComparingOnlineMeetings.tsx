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

export const ComparingOnlineMeetings = () => {
  const { t } = useTranslation('blog');
  return (
    <>
      <section>
        <p>{t('posts.comparing-online-meetings-stooa-fishbowl.content.introBlock')}</p>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.introBlock2"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
      </section>
      <section id="round-robin">
        <h2>{t('posts.comparing-online-meetings-stooa-fishbowl.content.roundRobin')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.roundRobinDescription"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
      </section>
      <section id="panel-discussion">
        <h2>{t('posts.comparing-online-meetings-stooa-fishbowl.content.panelDiscussion')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.panelDiscussionDescription"
            components={{
              span: <span className="medium" />,
              s: <s />
            }}
          />
        </p>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/compare/classroom.jpg"
          fill
          alt="An old photo of a woman teaching kids."
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      <section id="brainstorming">
        <h2>{t('posts.comparing-online-meetings-stooa-fishbowl.content.brainstorming')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.brainstormingDescription"
            components={{
              br: <br />,
              span: <span className="medium" />
            }}
          />
        </p>
      </section>
      <section id="stooa">
        <h2>{t('posts.comparing-online-meetings-stooa-fishbowl.content.whyStooa')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.whyFirst"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.whySecond"
            components={{
              span: <span className="medium" />
            }}
          />
        </p>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/compare/dog-fishbowl.jpeg"
          fill
          alt="Dog looking at a fishbowl."
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      <section id="cases">
        <h2>{t('posts.comparing-online-meetings-stooa-fishbowl.content.realLifeCases')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.realLifeCasesDescription"
            components={{ span: <span className="medium" /> }}
          />
        </p>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.realLifeVideo"
            components={{
              a: <a href="https://www.youtube.com/watch?v=j6gZAduchC8" target="_blank" />
            }}
          />
        </p>
      </section>

      <section id="conclusion">
        <h2>{t('posts.comparing-online-meetings-stooa-fishbowl.content.conclusion')}</h2>
        <p>
          <Trans
            i18nKey="blog:posts.comparing-online-meetings-stooa-fishbowl.content.conclusionDescription"
            components={{ span: <span className="medium" /> }}
          />
        </p>
      </section>
    </>
  );
};
