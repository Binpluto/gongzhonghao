import React, { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const Preview = ({ content }) => {
  // 配置marked选项
  const renderer = new marked.Renderer()
  
  // 自定义渲染器以适配微信公众号样式
  renderer.heading = (text, level) => {
    const sizes = {
      1: 'text-2xl font-bold mb-6 mt-8 text-gray-900 border-b-2 border-wechat-green pb-2',
      2: 'text-xl font-bold mb-4 mt-6 text-gray-800',
      3: 'text-lg font-bold mb-3 mt-5 text-gray-700',
      4: 'text-base font-bold mb-2 mt-4 text-gray-600',
      5: 'text-sm font-bold mb-2 mt-3 text-gray-600',
      6: 'text-xs font-bold mb-1 mt-2 text-gray-600'
    }
    return `<h${level} class="${sizes[level]}">${text}</h${level}>`
  }
  
  renderer.paragraph = (text) => {
    return `<p class="mb-4 leading-relaxed text-gray-700 text-justify">${text}</p>`
  }
  
  renderer.blockquote = (quote) => {
    return `<blockquote class="border-l-4 border-wechat-green bg-green-50 pl-4 py-2 italic text-gray-600 mb-4 rounded-r-lg">${quote}</blockquote>`
  }
  
  renderer.code = (code, language) => {
    return `<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono"><code class="language-${language || 'text'}">${code}</code></pre>`
  }
  
  renderer.codespan = (code) => {
    return `<code class="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">${code}</code>`
  }
  
  renderer.list = (body, ordered) => {
    const tag = ordered ? 'ol' : 'ul'
    const className = ordered ? 'list-decimal' : 'list-disc'
    return `<${tag} class="${className} pl-6 mb-4 space-y-1">${body}</${tag}>`
  }
  
  renderer.listitem = (text) => {
    return `<li class="text-gray-700 leading-relaxed">${text}</li>`
  }
  
  renderer.image = (href, title, text) => {
    return `<div class="text-center mb-6">
      <img src="${href}" alt="${text}" title="${title || ''}" class="max-w-full h-auto rounded-lg shadow-md mx-auto" />
      ${text ? `<p class="text-sm text-gray-500 mt-2 italic">${text}</p>` : ''}
    </div>`
  }
  
  renderer.link = (href, title, text) => {
    return `<a href="${href}" title="${title || ''}" class="text-wechat-green hover:text-green-600 underline font-medium" target="_blank" rel="noopener noreferrer">${text}</a>`
  }
  
  renderer.strong = (text) => {
    return `<strong class="font-bold text-gray-900">${text}</strong>`
  }
  
  renderer.em = (text) => {
    return `<em class="italic text-gray-600">${text}</em>`
  }
  
  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  })

  const htmlContent = useMemo(() => {
    if (!content) return ''
    const rawHtml = marked(content)
    return DOMPurify.sanitize(rawHtml)
  }, [content])

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">预览效果</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>微信公众号样式</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>实时渲染</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-none mx-auto p-8">
          <article 
            className="preview-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>预计阅读时间: {Math.ceil(content.length / 400)} 分钟</span>
            <span>字符数: {content.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-wechat-green">✓</span>
            <span>样式已优化</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview