/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Cross from 'ui/svg/cross.svg';
import OnboardingModal from 'components/App/ModalOnBoarding/styles';

interface IProps {
  show: boolean;
  closeModal: () => void;
  children: any;
}

const Onboarding: React.FC<IProps> = ({ show, closeModal, children }) => {
  return (
    <OnboardingModal className={!show ? 'hide' : 'show'}>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        {children}
      </div>
    </OnboardingModal>
  );
};

export default Onboarding;
