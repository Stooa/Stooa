/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Link from 'next/link';

import { APP_NAME } from '@/app.config';
import LogoStyled, { LogoAppStyled } from '@/components/Common/Logo/styles';

interface Props {
  href?: string;
  className?: string;
}

const Logo = ({ href = '', className, ...props }: Props) => {
  return href ? (
    <Link href={href} passHref legacyBehavior>
      <LogoStyled as="a" className={className} {...props}>
        {APP_NAME}
      </LogoStyled>
    </Link>
  ) : (
    <LogoAppStyled className={`logo ${className}`}>{APP_NAME}</LogoAppStyled>
  );
};

export default Logo;
