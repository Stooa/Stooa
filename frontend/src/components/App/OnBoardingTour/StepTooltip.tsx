/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React  from 'react';

interface StepProps {
  title?: string;
  text?: string;
  img?: string;
}

const StepTooltip = ({ title, text, img } : StepProps) => {
  return (
    <div>
      {img &&
        <img src={img}/>
      }
      {title &&
        <h1>{title}</h1>
      }
      {text &&
        <p>{text}</p>
      }
    </div>
  );
};

export default StepTooltip;
