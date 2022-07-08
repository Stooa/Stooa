/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type step = {
  element?: string;
  intro: string;
};

const getTourSteps = (): step[] => {
  return [
    {
      intro: 'First step'
    },
    {
      element: '.button-join',
      intro: 'Join conversation'
    },
    {
      element: '.seats-wrapper',
      intro: 'Chairs step'
    },
    {
      element: '.participant-toggle',
      intro: 'Participants step'
    }
  ];
};

export { getTourSteps };
