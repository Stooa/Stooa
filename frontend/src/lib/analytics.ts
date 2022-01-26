/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { UAPageView, UAEvent } from '@/types/analytics';

const dataLayerPush = (data: Record<string, unknown>) => {
  window?.dataLayer && window.dataLayer.push(data);
};

const pushEventDataLayer = ({ action = '', category = '', label = '', value = '' }: UAEvent) => {
  const event = {
    event: 'GAEvent',
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    eventValue: value
  };

  dataLayerPush(event);
};

const pushPageViewDataLayer = ({ url, title }: UAPageView) => {
  const pageEvent = {
    event: 'GAPageView',
    pageViewUrl: url,
    pageViewTitle: title
  };

  dataLayerPush(pageEvent);
};

export { dataLayerPush, pushEventDataLayer, pushPageViewDataLayer };
