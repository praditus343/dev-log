<template>
  <div class="rich-editor-wrapper">
    <!-- Toolbar -->
    <div v-if="editor" class="editor-toolbar">
      <!-- Text Style -->
      <div class="toolbar-group">
        <select @change="setHeading($event.target.value)" class="toolbar-select" title="Heading">
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Inline Format -->
      <div class="toolbar-group">
        <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{'active': editor.isActive('bold')}" class="toolbar-btn" title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{'active': editor.isActive('italic')}" class="toolbar-btn" title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{'active': editor.isActive('underline')}" class="toolbar-btn" title="Underline (Ctrl+U)">
          <u>U</u>
        </button>
        <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{'active': editor.isActive('strike')}" class="toolbar-btn" title="Strikethrough">
          <s>S</s>
        </button>
        <button type="button" @click="editor.chain().focus().toggleCode().run()" :class="{'active': editor.isActive('code')}" class="toolbar-btn font-mono text-xs" title="Inline Code">
          &lt;/&gt;
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Alignment -->
      <div class="toolbar-group">
        <button type="button" @click="editor.chain().focus().setTextAlign('left').run()" :class="{'active': editor.isActive({ textAlign: 'left' })}" class="toolbar-btn" title="Align Left">
          ≡
        </button>
        <button type="button" @click="editor.chain().focus().setTextAlign('center').run()" :class="{'active': editor.isActive({ textAlign: 'center' })}" class="toolbar-btn" title="Align Center">
          ≡
        </button>
        <button type="button" @click="editor.chain().focus().setTextAlign('right').run()" :class="{'active': editor.isActive({ textAlign: 'right' })}" class="toolbar-btn" title="Align Right">
          ≡
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Lists -->
      <div class="toolbar-group">
        <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{'active': editor.isActive('bulletList')}" class="toolbar-btn" title="Bullet List">
          • ≡
        </button>
        <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{'active': editor.isActive('orderedList')}" class="toolbar-btn" title="Numbered List">
          1. ≡
        </button>
        <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{'active': editor.isActive('blockquote')}" class="toolbar-btn" title="Blockquote">
          ❝
        </button>
        <button type="button" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{'active': editor.isActive('codeBlock')}" class="toolbar-btn font-mono text-xs" title="Code Block">
          { }
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Media & Links -->
      <div class="toolbar-group">
        <button type="button" @click="addLink" :class="{'active': editor.isActive('link')}" class="toolbar-btn" title="Insert Link">
          🔗
        </button>
        <button type="button" @click="addImageUrl" class="toolbar-btn" title="Insert Image from URL">
          🖼
        </button>
        <label class="toolbar-btn cursor-pointer" title="Upload Image">
          📁
          <input type="file" accept="image/*" @change="uploadImage" class="hidden"/>
        </label>
        <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" class="toolbar-btn" title="Horizontal Rule">
          —
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- History -->
      <div class="toolbar-group">
        <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="toolbar-btn" title="Undo">↩</button>
        <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="toolbar-btn" title="Redo">↪</button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="upload-progress">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
      Uploading image...
    </div>

    <!-- Editor Content Area -->
    <EditorContent :editor="editor" class="editor-content" />

    <!-- Word count -->
    <div v-if="editor" class="editor-footer">
      {{ editor.storage.characterCount?.words() ?? wordCount }} words · {{ editor.getText().length }} characters
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Start writing your article...' }
})
const emit = defineEmits(['update:modelValue'])
const supabase = useSupabaseClient()
const uploading = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Image.configure({ inline: true, allowBase64: true }),
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'article-link' } }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: props.placeholder })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: { class: 'prose-editor' }
  }
})

// Sync external changes (e.g. when editing existing article)
watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

const wordCount = computed(() => {
  if (!editor.value) return 0
  return editor.value.getText().split(/\s+/).filter(Boolean).length
})

const setHeading = (level) => {
  const lvl = parseInt(level)
  if (lvl === 0) {
    editor.value.chain().focus().setParagraph().run()
  } else {
    editor.value.chain().focus().toggleHeading({ level: lvl }).run()
  }
}

const addLink = () => {
  const url = window.prompt('Enter URL:', 'https://')
  if (url) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}

const addImageUrl = () => {
  const url = window.prompt('Enter image URL:', 'https://')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const uploadImage = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const ext = file.name.split('.').pop()
    const path = `article-images/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file)
    if (error) {
      if (error.message.includes('Bucket not found')) {
        alert('Create the "portfolio_assets" bucket in Supabase Storage (public) first!')
        return
      }
      throw error
    }
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path)
    editor.value.chain().focus().setImage({ src: data.publicUrl }).run()
  } catch (err) {
    alert(`Upload failed: ${err.message}`)
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

onBeforeUnmount(() => { editor.value?.destroy() })
</script>

<style>
.rich-editor-wrapper {
  border: 1px solid #334155;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #0f172a;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 1px;
}

.toolbar-divider {
  width: 1px;
  height: 22px;
  background: #334155;
  margin: 0 4px;
}

.toolbar-btn {
  min-width: 32px;
  height: 30px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #94a3b8;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.15s;
}
.toolbar-btn:hover { background: #334155; color: #fff; }
.toolbar-btn.active { background: #22c55e20; color: #4ade80; }
.toolbar-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.toolbar-select {
  height: 30px;
  padding: 0 6px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #cbd5e1;
  font-size: 0.8rem;
  cursor: pointer;
  outline: none;
}

.upload-progress {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #0f172a;
  border-bottom: 1px solid #334155;
  color: #4ade80;
  font-size: 0.8rem;
}

.editor-content {
  min-height: 400px;
  padding: 1.5rem;
}

.editor-footer {
  padding: 6px 16px;
  background: #1e293b;
  border-top: 1px solid #334155;
  color: #475569;
  font-size: 0.75rem;
  text-align: right;
}

/* Prose styles for the editor area */
.prose-editor {
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.8;
  outline: none;
  min-height: 380px;
}
.prose-editor h1 { font-size: 2rem; font-weight: 800; color: white; margin: 1.2rem 0 0.6rem; }
.prose-editor h2 { font-size: 1.5rem; font-weight: 700; color: white; margin: 1rem 0 0.5rem; }
.prose-editor h3 { font-size: 1.2rem; font-weight: 700; color: #e2e8f0; margin: 0.9rem 0 0.4rem; }
.prose-editor p { margin: 0.6rem 0; color: #cbd5e1; }
.prose-editor strong { color: white; font-weight: 700; }
.prose-editor em { color: #e2e8f0; font-style: italic; }
.prose-editor u { text-decoration: underline; }
.prose-editor s { text-decoration: line-through; opacity: 0.7; }
.prose-editor code { background: #334155; color: #4ade80; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.87em; }
.prose-editor pre { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
.prose-editor pre code { background: none; padding: 0; color: #4ade80; }
.prose-editor blockquote { border-left: 4px solid #22c55e; padding: 0.5rem 1rem; margin: 1rem 0; background: #22c55e0d; border-radius: 0 8px 8px 0; color: #94a3b8; font-style: italic; }
.prose-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
.prose-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
.prose-editor li { margin: 0.25rem 0; color: #cbd5e1; }
.prose-editor a { color: #4ade80; text-decoration: underline; }
.prose-editor img { max-width: 100%; border-radius: 8px; margin: 1rem 0; border: 1px solid #334155; }
.prose-editor hr { border: none; border-top: 1px solid #334155; margin: 1.5rem 0; }
.prose-editor .is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #475569;
  pointer-events: none;
  height: 0;
}
</style>
