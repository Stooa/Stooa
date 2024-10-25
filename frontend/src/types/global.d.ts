/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare global {
  let JitsiMeetJS: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  interface Window {
    dataLayer: Record<string, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    JitsiMeetJS?: JitsiMeetJS;
  }
}

export {};
