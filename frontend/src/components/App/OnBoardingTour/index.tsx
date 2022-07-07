/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState, useEffect, useRef } from 'react';

import dynamic from "next/dynamic";

const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), {
  ssr: false
});

const steps = [
  {
    element: '.test',
    intro: 'First step',
    position: 'right',
    tooltipClass: 'myTooltipClass',
    highlightClass: 'myHighlightClass',
  },
  {
    element: '.cta-create-fishbowl',
    intro: 'Crea un fishbowl ya veras',
  },
  {
    element: '.ph-badge ',
    intro: 'Arnold is número uno in product hunt',
  },
];

const introJSOptions = {
  nextLabel: 'next',
  prevLabel: 'prev',
  showStepNumbers: true,
  hintAnimation: true,
  showBullets: true,
  showButtons: true
};

const startCallback = () => {
  console.log('start callback');
}

const exitCallback = () => {
  console.log('exit callback');
}

const OnBoardingTour: React.FC = () => {
  return       <Steps
    onStart={startCallback}
    enabled={true}
    steps={steps}
    initialStep={0}
    onExit={exitCallback}
    options={introJSOptions}
  />;
};

export default OnBoardingTour;
