/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ROUTE_FISHBOWL_HOST_NOW } from '@/app.config';
import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';
import { pushEventDataLayer } from '@/lib/analytics';
import { useCallback, useEffect, useState } from 'react';
import { StyledButtonWrapper } from './styles';

const options = {
  rootMargin: '0px',
  threshold: 0.5
};

const FixedButton = ({ buttonText }: { buttonText: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showButton = useCallback(entries => {
    if (!entries[0].isIntersecting) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(showButton, options);

    const billboard = document.getElementById('billboard');

    if (billboard && observer) {
      observer.observe(billboard);
    }

    return () => {
      if (billboard && observer) {
        observer.unobserve(billboard);
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  } else {
    return (
      <StyledButtonWrapper>
        <RedirectLink href={ROUTE_FISHBOWL_HOST_NOW} passHref>
          <Button
            size="large"
            as="a"
            variant="primary"
            className=""
            onClick={() => {
              pushEventDataLayer({
                category: 'Host now fixed button',
                action: 'Billboard',
                label: 'Home'
              });
            }}
          >
            <span>{buttonText}</span>
          </Button>
        </RedirectLink>
      </StyledButtonWrapper>
    );
  }
};

export default FixedButton;
