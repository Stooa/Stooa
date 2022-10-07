/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { NextResponse } from 'next/server';
import flagsmith from 'flagsmith/next-middleware';

export async function middleware() {
  await flagsmith.init({
    environmentID: 'ser.dPTKAVcscTGXRXjGzXFaNX'
  });

  if (flagsmith.hasFeature('worldcafe')) {
    return NextResponse.redirect('/');
  }
}

export const config = {
  matcher: '/edit-profile'
};
