/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ROUTE_FISHBOWL_CREATE } from '@/app.config';
import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';
import { pushEventDataLayer } from '@/lib/analytics';
import { useEffect, useState } from 'react';
import { StyledButtonWrapper } from './styles';

const FixedButton = ({ buttonText }: { buttonText: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showButton = entries => {
    if (!entries[0].isIntersecting) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const billboard = document.getElementById('billboard');
  const options = {
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver(showButton, options);

  useEffect(() => {
    return () => {
      if (billboard) {
        observer.unobserve(billboard);
      }
    };
  }, []);

  if (billboard) {
    observer.observe(billboard);
  }

  if (!isVisible) {
    return null;
  } else {
    return (
      <StyledButtonWrapper>
        <RedirectLink href={ROUTE_FISHBOWL_CREATE} passHref>
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
