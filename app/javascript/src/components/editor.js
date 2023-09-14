import React, { useState, useCallback, useEffect } from 'react';
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Tooltip } from 'react-tippy';

const MenuBar = ({ onSave, setValue, setEditing }) => {
  const { editor } = useCurrentEditor();

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    let url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    if (!(url.includes('http://') || url.includes('https://'))) {
      url = 'https://' + url;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  if (!editor) {
    return null
  }


  return(
    <div className='menu-bar'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'btn-black' : 'btn-white'}
      >
        <Tooltip
            title="Bold"
        >
          <i className='fa-solid fa-bold'/>
        </Tooltip>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'btn-black' : 'btn-white'}
      >
        <Tooltip
            title="Italic"
        >
          <i className='fa-solid fa-italic'/>
        </Tooltip>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'btn-black' : 'btn-white'}
      >
        <Tooltip
            title="Strikethrough"
        >
          <i className='fa-solid fa-strikethrough'/>
        </Tooltip>
      </button>
      <button onClick={setLink} className={editor.isActive('link') ? 'btn-black' : 'btn-white'}>
        <Tooltip
            title="Link"
        >
          <i className='fa-solid fa-link'/>
        </Tooltip>
      </button>
      <button
        className='btn-white'
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        <Tooltip
            title="Unlink"
        >
          <i className='fa-solid fa-link-slash'/>
        </Tooltip>
      </button>
      {/* <button className='btn-white' onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button className='btn-white' onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'btn-black' : 'btn-white'}
      >
        <Tooltip
            title="Paragraph"
        >
          <i className='fa-solid fa-paragraph'/>
        </Tooltip>
      </button> */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'btn-black' : 'btn-white'}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'btn-black' : 'btn-white'}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'btn-black' : 'btn-white'}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'btn-black' : 'btn-white'}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'btn-black' : 'btn-white'}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'btn-black' : 'btn-white'}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'btn-black' : 'btn-white'}
      >
        <Tooltip
            title="Bullet List"
        >
          <i className='fa-solid fa-list'/>
        </Tooltip>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'btn-black' : 'btn-white'}
      >
        <Tooltip
            title="Numbered List"
        >
          <i className='fa-solid fa-list-ol'/>
        </Tooltip>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'btn-black' : 'btn-white'}
      >
        <Tooltip
            title="Block Quote"
        >
          <i className='fa-solid fa-quote-right'/>
        </Tooltip>
      </button>
      <button
        className='btn-white'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        <Tooltip
            title="Undo"
        >
          <i className='fa-solid fa-rotate-left'/>
        </Tooltip>
      </button>
      <button
        className='btn-white'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        <Tooltip
            title="Redo"
        >
          <i className='fa-solid fa-rotate-right'/>
        </Tooltip>
      </button>
      <button
        className='btn-black'
        onClick={() => {
          setValue(editor.getHTML());
          onSave(editor.getHTML());
          setEditing(false);
        }}
      >
        <Tooltip
            title="Save"
        >
          <i className='fa-solid fa-save'/>
        </Tooltip>
      </button>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  Placeholder.configure({
    // Use a placeholder:
    placeholder: 'Write any notes you have here...',
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Link.configure()
]

const Editor = ({ owner, onSave, defaultValue, userName }) => {
  const [editing, setEditing] = useState(!defaultValue);
  const [value, setValue] = useState(defaultValue);

  if (owner) {
    return(
      <div>
        <div className='flex justify-between items-center'>
          <p className='b-copy' style={{ fontSize: '18px', margin: '20px 0px 10px 0px'}}>Your Notes</p>
          {!editing && <button className='btn-black' onClick={() => setEditing(true)}>
            <i className='fa-solid fa-edit mr-3'/>
            Edit
          </button>}
        </div>
        <div className={editing ? 'tiptap-editing tiptap-container' : 'tiptap-container'}>
          <EditorProvider
            key={editing}
            slotBefore={editing ? <MenuBar setValue={setValue} onSave={onSave} setEditing={setEditing} /> : <div/>}
            extensions={extensions}
            content={value}
            editable={editing}
          ></EditorProvider>
        </div>
      </div>
    )
  } else if (!!defaultValue) {
    return(
      <div>
        <p className='b-copy' style={{ fontSize: '18px', margin: '20px 0px 10px 0px'}}>{userName}'s Notes</p>
        <EditorProvider
          extensions={extensions}
          content={defaultValue}
          editable={false}
        ></EditorProvider>
      </div>
    )
  } else {
    return <div/>;
  }
};

export default Editor;
