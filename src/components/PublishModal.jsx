import React, { useState } from 'react'

const PublishModal = ({ isOpen, onClose, onConfirm, articleSettings, onSettingsChange }) => {
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishType, setPublishType] = useState('draft') // draft, publish, schedule
  const [scheduleTime, setScheduleTime] = useState('')

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!articleSettings.title.trim()) {
      alert('请输入文章标题')
      return
    }

    setIsPublishing(true)
    try {
      await onConfirm({
        ...articleSettings,
        publishType,
        scheduleTime: publishType === 'schedule' ? scheduleTime : null
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const getPublishButtonText = () => {
    if (isPublishing) return '发布中...'
    switch (publishType) {
      case 'draft': return '保存草稿'
      case 'publish': return '立即发布'
      case 'schedule': return '定时发布'
      default: return '发布'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">发布文章</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* 文章信息确认 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">文章信息确认</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">标题:</span>
                  <span className="font-medium text-gray-900 max-w-48 truncate">
                    {articleSettings.title || '未设置'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">作者:</span>
                  <span className="text-gray-900">{articleSettings.author || '未设置'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">封面:</span>
                  <span className="text-gray-900">
                    {articleSettings.coverImage ? '已设置' : '未设置'}
                  </span>
                </div>
              </div>
            </div>

            {/* 发布类型选择 */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">发布方式</h4>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="publishType"
                    value="draft"
                    checked={publishType === 'draft'}
                    onChange={(e) => setPublishType(e.target.value)}
                    className="text-wechat-green focus:ring-wechat-green"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">保存为草稿</div>
                    <div className="text-sm text-gray-500">保存文章但不发布，可稍后编辑</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="publishType"
                    value="publish"
                    checked={publishType === 'publish'}
                    onChange={(e) => setPublishType(e.target.value)}
                    className="text-wechat-green focus:ring-wechat-green"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">立即发布</div>
                    <div className="text-sm text-gray-500">文章将立即发布到公众号</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="publishType"
                    value="schedule"
                    checked={publishType === 'schedule'}
                    onChange={(e) => setPublishType(e.target.value)}
                    className="text-wechat-green focus:ring-wechat-green"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">定时发布</div>
                    <div className="text-sm text-gray-500 mb-2">设置发布时间</div>
                    {publishType === 'schedule' && (
                      <input
                        type="datetime-local"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="input-field text-sm"
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* 发布提醒 */}
            {publishType === 'publish' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">注意</p>
                    <p className="text-yellow-700 mt-1">
                      文章发布后将立即推送给所有关注用户，请确认内容无误。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={onClose}
              disabled={isPublishing}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPublishing || (publishType === 'schedule' && !scheduleTime)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              {isPublishing && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {getPublishButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishModal