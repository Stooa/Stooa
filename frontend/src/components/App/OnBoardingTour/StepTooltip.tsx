/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React  from 'react';
import useTranslation from "next-translate/useTranslation";

interface StepTooltipProps {
  title?: string;
  text?: string;
  img?: string;
}

const StepTooltip = ({ title, text, img } : StepTooltipProps) => {
  const { t } = useTranslation('on-boarding-tour');

  return (
    <div>
      {img &&
        <img src={img}/>
      }
      {title &&
        <h3>{t(title)}</h3>
      }
      {text &&
        <p>{t(text)}</p>
      }
    </div>
  );
};

export default StepTooltip;
