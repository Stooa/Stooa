/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';

import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import Check from '@/ui/svg/checkmark.svg';
import React from 'react';
import { useJitsi } from '@/lib/useJitsi';
import { Participant } from '@/types/participant';
import { StyledReasonGroup } from './styles';
import { pushEventDataLayer } from '@/lib/analytics';
import Button from '@/components/Common/Button';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface FormProps {
  participant: Participant;
  onCompletedSubmit: () => void;
}

const KickReasonForm = ({ participant, onCompletedSubmit }: FormProps) => {
  const { t } = useTranslation('fishbowl');
  const { kickParticipant } = useJitsi();
  const router = useRouter();
  const { fid } = router.query;

  const schema = Yup.object().shape({
    reason: Yup.string().required('Required message')
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = useForm<{ reason: string }>({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: REASON_NO_PARTICIPATING
    }
  });

  const whatchReason = watch('reason');

  const onSubmit = async values => {
    if (participant && values.reason) {
      pushEventDataLayer({
        action: fid as string,
        category: 'Kick',
        label: values.reason === REASON_CONDUCT_VIOLATION ? 'hard' : 'soft'
      });

      kickParticipant(participant.getId(), values.reason);
      toast(t('kick.successMessage'), {
        icon: <Check />,
        toastId: 'kick-success',
        type: 'success',
        position: 'bottom-center',
        autoClose: 5000
      });
    }
    onCompletedSubmit();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledReasonGroup role="group" aria-labelledby="reasons-radio-group">
          <label>
            <input type="radio" value={REASON_NO_PARTICIPATING} {...register('reason')} />
            <div
              className={`reason-card ${
                whatchReason === REASON_NO_PARTICIPATING ? 'selected' : ''
              }`}
            >
              <Image
                className="friend-image"
                src="/img/friends/meditating.png"
                alt="Illustration of a friend meditating"
                height={146.38}
                width={151}
                quality={100}
              />
              <p>{t('kick.modal.options.noParticipating')}</p>
            </div>
          </label>
          <label>
            <input type="radio" value={REASON_CONDUCT_VIOLATION} {...register('reason')} />
            <div
              className={`reason-card ${
                whatchReason === REASON_CONDUCT_VIOLATION ? 'selected' : ''
              }`}
            >
              <Image
                className="friend-image"
                src="/img/friends/reading.png"
                alt="Illustration of a friend reading"
                height={146}
                width={140.06}
                quality={100}
              />

              <p>{t('kick.modal.options.conductViolation')}</p>
            </div>
          </label>
        </StyledReasonGroup>
        <fieldset>
          <Button size="large" type="submit" disabled={isSubmitting}>
            {t('kick.modal.button')}
          </Button>
        </fieldset>
      </form>
    </>
  );
};

export default KickReasonForm;
