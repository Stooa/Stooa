/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Link from 'next/link';
import { StyledAnchorMenu } from './styles';
import useTranslation from 'next-translate/useTranslation';

export type BlogMenuItemType = { anchorId: string; displayText: string };

interface Props {
  items: BlogMenuItemType[];
}

const AnchorMenu = ({ items }: Props) => {
  const { t } = useTranslation('blog');
  return (
    <StyledAnchorMenu>
      {items.map(item => (
        <li key={item.anchorId}>
          <Link href={`#${item.anchorId}`}>{t(item.displayText)}</Link>
        </li>
      ))}
    </StyledAnchorMenu>
  );
};

export default AnchorMenu;
