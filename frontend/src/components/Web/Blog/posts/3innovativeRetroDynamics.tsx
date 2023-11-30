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
import { ROUTE_HOME } from '@/app.config';
import Button from '@/components/Common/Button';
import { pushEventDataLayer } from '@/lib/analytics';

export const InnovativeRetroDynamics = () => {
  const { t } = useTranslation('blog');
  return (
    <>
      <section id="starfish">
        <p>{t('posts.3-innovative-dynamics-for-retros.content.firstBlock')}</p>
        <h2>{t('posts.3-innovative-dynamics-for-retros.content.theStarfish')}</h2>

        <ul>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.starfishObjective"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.starfishHowItWorks"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.starfishBenefits"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
        </ul>

        <div className="image-container">
          <Image
            src="/img/web/blog/retros/starfish.jpg"
            fill
            alt="A starfish on sand underwater."
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </section>

      <section id="bullseye">
        <h2>{t('posts.3-innovative-dynamics-for-retros.content.bullseye')}</h2>
        <ul>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.bullseyeObjective"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.bullseyeHowItWorks"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.bullseyeBenefits"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.bullseyeTime"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
        </ul>

        <p>{t('posts.3-innovative-dynamics-for-retros.content.bullseyeTip')}</p>
      </section>

      <div className="image-container">
        <Image
          src="/img/web/blog/retros/darts.jpg"
          fill
          alt="Old photo of men playing darts."
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <section id="fishbowl">
        <h2>{t('posts.3-innovative-dynamics-for-retros.content.fishbowl')}</h2>

        <ul>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.fishbowlObjective"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.fishbowlHowItWorks"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.fishbowlBenefits"
              components={{
                span: <span className="medium" />
              }}
            />
          </li>
        </ul>
        <p>{t('posts.3-innovative-dynamics-for-retros.content.alreadyKnew')}</p>
        <p>{t('posts.3-innovative-dynamics-for-retros.content.tryStooa')}</p>
        <div className="schedule-cta centered">
          <RedirectLink href={ROUTE_HOME} passHref>
            <Button
              size="large"
              as="a"
              className="animate-item cta-create-fishbowl "
              onClick={() => {
                pushEventDataLayer({
                  category: 'Home',
                  action: 'Innovative retros',
                  label: 'Blog'
                });
              }}
            >
              <span>{t('blogCTA')}</span>
            </Button>
          </RedirectLink>
        </div>
      </section>

      <div className="article-reference">
        <p>{t('posts.3-innovative-dynamics-for-retros.content.feedback')}</p>
        <p>
          <Trans
            i18nKey="blog:posts.3-innovative-dynamics-for-retros.content.originalPost"
            components={{
              a: (
                <a
                  href="https://es.linkedin.com/pulse/3-din%C3%A1micas-innovadoras-para-tus-retrospectivas-de-pazos-pungitore-bjybf?trk=public_post_feed-article-content"
                  target="_blank"
                  rel="noreferrer"
                />
              )
            }}
          />
        </p>
      </div>
    </>
  );
};
