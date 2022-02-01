/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CREATE_FISHBOWL } from '@/graphql/Fishbowl';
import { useMutation } from '@apollo/client';
import { useEffect } from 'react';

const HostNow = () => {
  const [createFishbowl] = useMutation(CREATE_FISHBOWL);

  const createFishbowlRequest = async () => {
    const dateNow = new Date();
    const formatedDay = formatDateTime(dateNow.getDate());

    await createFishbowl({
      variables: {
        input: {
          name: '',
          description: '',
          startDateTime: dateNow,
          timezone: values.timezone,
          duration: values.hours,
          locale: values.language,
          isFishbowlNow: true
        }
      }
    })
      .then(res => {})
      .catch(error => {});
  };

  return <></>;
};

export default HostNow;
