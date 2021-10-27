/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from 'ui/Button';
import ArrowRight from 'ui/svg/arrow-right.svg';
import { List, Title } from 'components/App/FishbowlRules/styles';

const FishbowlRules = ({ action }) => {
  return (
    <>
      <Title className="title-sm">📐The 3 fishbowl rules</Title>
      <List>
        <li className="text-sm">
          Everyone is welcomed to participate both as a speaker and as an observer.
        </li>
        <li className="text-sm">
          Feel free to occupy a “seat” whenever you want to engage in the discussion.
        </li>
        <li className="text-sm">
          It should always be an empty “seat”. Should someone occupies a seat, another speaker
          should leave.
        </li>
      </List>
      <Button full onClick={action}>
        <span>Join the conversation</span>
        <ArrowRight />
      </Button>
    </>
  );
};

export default FishbowlRules;
