/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { StyledEditorWrapper, StyledToolbar, ToolbarButton } from './styles';

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>'
  });

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
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={makeItalic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={makeList}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          UL
        </ToolbarButton>
        <ToolbarButton
          onClick={makeOrderedList}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          OL
        </ToolbarButton>
      </StyledToolbar>
      <EditorContent editor={editor} />
    </StyledEditorWrapper>
  );
};

export default Tiptap;
