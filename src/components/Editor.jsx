import React, { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'

const MarkdownEditor = ({ content, onChange }) => {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // 配置编辑器主题和选项
    monaco.editor.defineTheme('wechat-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
      }
    })
    
    monaco.editor.setTheme('wechat-theme')
  }

  const handleEditorChange = (value) => {
    onChange(value || '')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Markdown 编辑器</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>支持标准Markdown语法</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>实时预览</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 1.6,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderWhitespace: 'selection'
          }}
        />
      </div>
      
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>字数: {content.length}</span>
            <span>行数: {content.split('\n').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+S</kbd>
            <span>保存</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarkdownEditor