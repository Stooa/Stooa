/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Editor, EditorContent } from '@tiptap/react';
import { StyledEditorWrapper, StyledToolbar, ToolbarButton } from './styles';
import Bold from '@/ui/svg/richtext/bold.svg';
import Italic from '@/ui/svg/richtext/italic.svg';
import List from '@/ui/svg/richtext/bullet-list.svg';
import OrderedList from '@/ui/svg/richtext/ordered-list.svg';
import Link from '@/ui/svg/richtext/link.svg';

import { useCallback } from 'react';

interface Props {
  editor: Editor | null;
}

const RichText = ({ editor }: Props) => {
  const makeBold = event => {
    event.preventDefault();
    if (!editor) {
      return;
    }
    editor.chain().focus().toggleBold().run();
  };

  const makeItalic = event => {
    event.preventDefault();
    if (!editor) {
      return;
    }
    editor.chain().focus().toggleItalic().run();
  };

  const makeList = event => {
    event.preventDefault();
    if (!editor) {
      return;
    }
    editor.chain().focus().toggleBulletList().run();
  };

  const makeOrderedList = event => {
    event.preventDefault();
    if (!editor) {
      return;
    }
    editor.chain().focus().toggleOrderedList().run();
  };

  const setLink = useCallback(
    event => {
      event.preventDefault();
      if (!editor) {
        return;
      }

      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();

        return;
      }

      // update link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    },
    [editor]
  );

  const unsetLink = useCallback(
    event => {
      event.preventDefault();
      if (!editor) {
        return;
      }

      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <StyledEditorWrapper>
      <StyledToolbar>
        <ToolbarButton
          onClick={makeBold}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          onClick={makeItalic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          onClick={makeList}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          onClick={makeOrderedList}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <OrderedList />
        </ToolbarButton>
        <ToolbarButton
          onClick={!editor.isActive('link') ? setLink : unsetLink}
          className={editor.isActive('link') ? 'is-active' : ''}
        >
          <Link />
        </ToolbarButton>
        {/* <ToolbarButton onClick={unsetLink} disabled={!editor.isActive('link')}>
          unsetLink
        </ToolbarButton> */}
      </StyledToolbar>
      <EditorContent editor={editor} />
    </StyledEditorWrapper>
  );
};

export default RichText;
