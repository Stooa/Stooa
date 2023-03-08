/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SatisfactionData } from '@/types/feedback';
import { StyledSummaryWrapper } from './styles';

interface Props {
  satisfactionData: SatisfactionData;
  participants: number;
}

const SatisfactionSummary = ({ satisfactionData, participants }: Props) => {
  return <StyledSummaryWrapper>aaa</StyledSummaryWrapper>;
};

export default SatisfactionSummary;
