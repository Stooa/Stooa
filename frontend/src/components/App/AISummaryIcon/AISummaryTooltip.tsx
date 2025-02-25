/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { Ref, forwardRef } from 'react';
import { StyledAITooltip } from './styles';

export const AISummaryTooltip = forwardRef<HTMLDivElement>(
  (_props: unknown, ref: Ref<HTMLDivElement>) => {
    return (
      <StyledAITooltip shadow className="body-xs" ref={ref}>
        <p>
          Se esta generando un resumen con IA, al que tendrá acceso el organizador del evento una
          vez terminado el Fishbowl.
        </p>
      </StyledAITooltip>
    );
  }
);
