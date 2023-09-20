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

interface Props {
  slug: string;
}

const CopyEmbedFishbowl = ({ slug }: Props) => {
  const embedToCopy = `<iframe src="${process.env.NEXT_PUBLIC_APP_DOMAIN}/fb/${slug}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedToCopy);
    toast('IFrame copiado correctamente', {
      icon: <Check />,
      toastId: 'link-copied',
      type: 'success',
      position: 'bottom-center',
      autoClose: 5000
    });
  };

  return <button onClick={handleCopyEmbed}> TAL NOSEQUE</button>;
};

export default CopyEmbedFishbowl;
