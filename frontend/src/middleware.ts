/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import flagsmith from 'flagsmith/next-middleware';

export async function middleware(request: NextRequest) {
  await flagsmith.init({
    environmentID: 'ser.dPTKAVcscTGXRXjGzXFaNX'
  });

  const worldcafe = flagsmith.hasFeature('worldcafe');

  console.log('Saura FLAG', worldcafe);

  //redirect to an account page based on the multivariate flag
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: '/edit-profile'
};
