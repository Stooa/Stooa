/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledIframe } from './styles';

interface Props {
  src: string;
  allowFullScreen?: boolean;
}

const YoutubeEmbed = ({ src, allowFullScreen = true }: Props) => {
  return (
    <StyledIframe
      className="youtube-stooa"
      src={src}
      title="Stooa. The online fishbowl tool."
      allow="accelerometer; autoplay; clipboard-write; encrypted-media;  picture-in-picture; web-share;"
      allowFullScreen={allowFullScreen}
    />
  );
};

export default YoutubeEmbed;
