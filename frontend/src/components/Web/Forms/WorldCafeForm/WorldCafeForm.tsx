/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import NewInput from '@/components/Common/Fields/updated/Input';
import NewTextarea from '@/components/Common/Fields/updated/Textarea';
import { useForm } from 'react-hook-form';
import { StyledAddButton, StyledScrollWrapper, StyledWorldCafeForm } from './styles';
import Select from '@/components/Common/Fields/updated/Select';
import Switch from '@/components/Common/Fields/updated/Switch';
import { useRef } from 'react';

const WorldCafeForm = () => {
  const {
    register,
    formState: { errors, dirtyFields, isDirty }
  } = useForm();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleAddNewTopic = () => {};

  const handleScrollToSlide = event => {
    event.preventDefault();
    wrapperRef.current && wrapperRef.current?.scrollTo({ left: 600, behavior: 'smooth' });
  };

  return (
    <StyledWorldCafeForm>
      <h2>World cafe form</h2>
      <button onClick={handleScrollToSlide}>scroll to</button>
      <StyledScrollWrapper ref={wrapperRef}>
        <div id="step-general">
          <NewInput label="Title" />
          <NewTextarea label="Description" />

          <StyledAddButton onClick={handleAddNewTopic}>+ Add topic</StyledAddButton>

          <h3>Round duration</h3>

          <Select label="Cada ronda dura">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </Select>

          <Switch label="Añadir 5 minutos extra a la primera ronda" />

          <Button
            data-testid="feedback-comment-send-button"
            type="submit"
            color="primary"
            variant="text"
          >
            Siguiente
          </Button>
        </div>
        <div id="step-questions">
          <h3>Questions</h3>
          <NewInput label="Question 1" />
          <NewInput label="Question 2" />
          <NewInput label="Question 3" />
        </div>
      </StyledScrollWrapper>
    </StyledWorldCafeForm>
  );
};

export default WorldCafeForm;
