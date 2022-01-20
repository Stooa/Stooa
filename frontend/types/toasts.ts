/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface ToastContent {
  type: string;
  message: string;
}

export interface Toast {
  id?: number;
  type: string;
  message: string;
  dismissed?: boolean;
  autoClose?: number;
}
