import React, { useState } from 'react'

const Sidebar = ({ articleSettings, onSettingsChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleInputChange = (field, value) => {
    onSettingsChange({
      ...articleSettings,
      [field]: value
    })
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('coverImage', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="展开侧边栏"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">文章设置</h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="收起侧边栏"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 基本信息 */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            基本信息
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              文章标题 *
            </label>
            <input
              type="text"
              value={articleSettings.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="请输入文章标题"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              作者
            </label>
            <input
              type="text"
              value={articleSettings.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="请输入作者名称"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              文章摘要
            </label>
            <textarea
              value={articleSettings.digest}
              onChange={(e) => handleInputChange('digest', e.target.value)}
              placeholder="请输入文章摘要（选填）"
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* 封面图片 */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            封面图片
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {articleSettings.coverImage ? (
              <div className="relative">
                <img
                  src={articleSettings.coverImage}
                  alt="封面预览"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleInputChange('coverImage', null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">点击上传封面图片</p>
                  <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* 发布选项 */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            发布选项
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-wechat-green focus:ring-wechat-green" />
              <span className="ml-2 text-sm text-gray-700">开启原创声明</span>
            </label>
            
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-wechat-green focus:ring-wechat-green" />
              <span className="ml-2 text-sm text-gray-700">允许转载</span>
            </label>
            
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-wechat-green focus:ring-wechat-green" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">开启留言功能</span>
            </label>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">文章统计</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">字数统计</span>
              <p className="font-medium text-gray-900">0</p>
            </div>
            <div>
              <span className="text-gray-500">预计阅读</span>
              <p className="font-medium text-gray-900">0 分钟</p>
            </div>
            <div>
              <span className="text-gray-500">段落数</span>
              <p className="font-medium text-gray-900">0</p>
            </div>
            <div>
              <span className="text-gray-500">图片数</span>
              <p className="font-medium text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar