import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Sidebar from './components/Sidebar'
import PublishModal from './components/PublishModal'

function App() {
  const [content, setContent] = useState('# 欢迎使用微信公众号文章发布工具\n\n在左侧编辑器中输入Markdown内容，右侧会实时预览排版效果。\n\n## 功能特性\n\n- 📝 Markdown编辑器\n- 👀 实时预览\n- 🎨 自动排版\n- 📱 微信公众号样式\n- 🚀 一键发布\n\n开始创作你的文章吧！')
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [articleSettings, setArticleSettings] = useState({
    title: '',
    author: '',
    digest: '',
    coverImage: null
  })

  const handleContentChange = useCallback((newContent) => {
    setContent(newContent)
  }, [])

  const handlePublish = () => {
    setIsPublishModalOpen(true)
  }

  const handlePublishConfirm = async (settings) => {
    try {
      // 这里将调用发布API
      console.log('发布文章:', { content, ...settings })
      setIsPublishModalOpen(false)
      alert('文章发布成功！')
    } catch (error) {
      console.error('发布失败:', error)
      alert('发布失败，请重试')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onPublish={handlePublish} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          articleSettings={articleSettings}
          onSettingsChange={setArticleSettings}
        />
        
        <div className="flex-1 flex">
          <div className="w-1/2 border-r border-gray-200">
            <Editor 
              content={content}
              onChange={handleContentChange}
            />
          </div>
          
          <div className="w-1/2">
            <Preview content={content} />
          </div>
        </div>
      </div>

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublishConfirm}
        articleSettings={articleSettings}
        onSettingsChange={setArticleSettings}
      />
    </div>
  )
}

export default App