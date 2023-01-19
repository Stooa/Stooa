/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Image from 'next/image';
import { StyledList } from './styles';

const FishbowlExplanation = () => {
  return (
    <>
      <StyledList>
        <li className="animate-item">
          <Image src="/img/web/explanation/chair.png" alt="Fishbowl chair" width={79} height={72} />
          <div>
            <h4 className="title-md">5 sillas para debatir</h4>
            <p className="body-lg">
              Para participar en el debate tendrás que ocupar una de las sillas.
            </p>
          </div>
        </li>
        <li className="animate-item">
          <Image
            src="/img/web/explanation/talking-head.png"
            alt="Talking head"
            width={75}
            height={70}
          />
          <div className="animate-item">
            <h4 className="title-md">1 Silla libre para potenciar la participación</h4>
            <p className="body-lg">Siempre tiene que haber una silla libre.</p>
          </div>
        </li>
      </StyledList>
      <p className="body-lg animate-item">
        Cualquier asistente puede <strong>ocupar una silla libre</strong> en cualquier momento{' '}
        <strong>para participar en el debate</strong>. Si todas las{' '}
        <strong>sillas están ocupadas</strong> alguien que ya haya participado deberá{' '}
        <strong>dejar su asiento libre</strong>.
      </p>
    </>
  );
};

export default FishbowlExplanation;
