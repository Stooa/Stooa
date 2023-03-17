/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRouter } from 'next/router';
import Link from 'next/link';

const RedirectLink = ({ href, children, ...props }) => {
  const router = useRouter();
  const {
    query: { redirect }
  } = router;
  const url = redirect ? `${href}?redirect=${redirect}` : href;

  return (
    <Link href={url} {...props} legacyBehavior>
      {children}
    </Link>
  );
};

export default RedirectLink;
