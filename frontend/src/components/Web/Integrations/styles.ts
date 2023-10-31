/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BODY_LG, mediumWeight } from '@/ui/Texts';
import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_400 } from '@/ui/settings';
import styled from 'styled-components';

const IntegrationsSettingsWrapper = styled.div`
  width: 500px;
  padding-top: ${space(8)};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${space(3)};
`;

const StyledIntegrationItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  padding: ${space(2)};
  gap: ${space(4)};

  background-color: ${COLOR_NEUTRO_100};

  border: 1px solid ${COLOR_NEUTRO_400};
  border-radius: 8px;
`;

const StyledItemsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${space(2)};
`;

const StyledItemDescription = styled.div`
  ${BODY_LG};
  ${mediumWeight};

  display: flex;
  gap: ${space(2)};
  align-items: center;
`;

const StyledIntegrationContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export {
  IntegrationsSettingsWrapper,
  StyledIntegrationItem,
  StyledItemsWrapper,
  StyledItemDescription,
  StyledIntegrationContent
};
