/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface User {
  "@id"?: string;
  name: string;
  surnames: string;
  allowShareData?: boolean;
  linkedinProfile?: string;
  twitterProfile?: string;
  plainPassword?: string;
  readonly email: string;
  readonly locale: string;
}
