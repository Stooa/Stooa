/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface UAEvent {
  action?: string;
  category?: string;
  label?: string;
  value?: number;
}

export interface UAPageView {
  url?: string;
  title?: string;
}
