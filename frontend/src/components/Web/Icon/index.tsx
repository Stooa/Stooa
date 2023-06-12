/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Avatar from '@/ui/svg/avatar.svg';
import Checkmark from '@/ui/svg/checkmark.svg';
import Calendar from '@/ui/svg/calendar.svg';
import Clock from '@/ui/svg/clock.svg';
import Cross from '@/ui/svg/cross.svg';
import Hourglass from '@/ui/svg/hourglass.svg';
import Lock from '@/ui/svg/lock.svg';
import Mail from '@/ui/svg/mail.svg';
import World from '@/ui/svg/world.svg';
import ChevronDown from '@/ui/svg/chevron-down.svg';
import Language from '@/ui/svg/language.svg';
import { IconVariant } from '@/components/Common/Fields/Icon';

type IconProps = {
  className?: string;
  variant: IconVariant;
};

const Icon = ({ className = '', variant }: IconProps) => {
  const iconVariant = {
    'avatar': Avatar,
    'calendar': Calendar,
    'checkmark': Checkmark,
    'chevron-down': ChevronDown,
    'cross': Cross,
    'clock': Clock,
    'hourglass': Hourglass,
    'language': Language,
    'lock': Lock,
    'mail': Mail,
    'world': World
  };

  const IconComponent = iconVariant[variant];

  return <IconComponent className={className} />;
};

export default Icon;
