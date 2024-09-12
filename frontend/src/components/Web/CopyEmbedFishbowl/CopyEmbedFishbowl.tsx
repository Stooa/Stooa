/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { toast } from 'react-toastify';

import Check from '@/ui/svg/checkmark.svg';
import CodeSVG from '@/ui/svg/code.svg';
import { StyledCopyEmbedButton } from './styles';

interface Props {
  slug: string;
}

const CopyEmbedFishbowl = ({ slug }: Props) => {
  const embedToCopy = `<iframe src="${process.env.NEXT_PUBLIC_APP_DOMAIN}/fb/${slug}" width="100%" allow="clipboard-read; clipboard-write; camera *;microphone *" frameborder="no" height="650" ></iframe>`;
  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedToCopy);
    toast('iframe copiado correctamente', {
      icon: <Check />,
      toastId: 'link-copied',
      type: 'success',
      position: 'bottom-center',
      autoClose: 5000
    });
  };

  return (
    <StyledCopyEmbedButton onClick={handleCopyEmbed}>
      <CodeSVG />
    </StyledCopyEmbedButton>
  );
};

export default CopyEmbedFishbowl;
