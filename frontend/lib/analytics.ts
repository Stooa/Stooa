/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

interface IGAEvents {
  action?: string;
  category?: string;
  label?: string;
  value?: string;
}

interface IGTMPageView {
  url?: string;
  title?: string;
}

const dataLayerPush = (data: Record<string, unknown>) => {
  window?.dataLayer && window.dataLayer.push(data);
};

const GAEvent = ({ action = '', category = '', label = '', value = '' }: IGAEvents) => {
  const event = {
    event: 'GAEvent',
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    eventValue: value
  };

  dataLayerPush(event);
};

const GTMPageView = ({ url, title }: IGTMPageView) => {
  const pageEvent = {
    event: 'GAPageView',
    pageViewUrl: url,
    pageViewTitle: title
  };

  dataLayerPush(pageEvent);
};

export { GAEvent, dataLayerPush, GTMPageView };
