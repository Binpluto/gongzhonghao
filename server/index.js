const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'), false)
    }
  }
})

// 微信公众号配置
const WECHAT_CONFIG = {
  appId: process.env.WECHAT_APP_ID,
  appSecret: process.env.WECHAT_APP_SECRET,
  accessToken: null,
  tokenExpireTime: 0
}

// 获取微信访问令牌
async function getAccessToken() {
  if (WECHAT_CONFIG.accessToken && Date.now() < WECHAT_CONFIG.tokenExpireTime) {
    return WECHAT_CONFIG.accessToken
  }

  try {
    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_CONFIG.appId}&secret=${WECHAT_CONFIG.appSecret}`
    )
    const data = await response.json()
    
    if (data.access_token) {
      WECHAT_CONFIG.accessToken = data.access_token
      WECHAT_CONFIG.tokenExpireTime = Date.now() + (data.expires_in - 300) * 1000 // 提前5分钟过期
      return data.access_token
    } else {
      throw new Error(data.errmsg || '获取访问令牌失败')
    }
  } catch (error) {
    console.error('获取微信访问令牌失败:', error)
    throw error
  }
}

// API路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' })
})

// 上传图片
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' })
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    })
  } catch (error) {
    console.error('文件上传失败:', error)
    res.status(500).json({ error: '文件上传失败' })
  }
})

// 上传媒体文件到微信服务器
app.post('/api/wechat/upload-media', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' })
    }

    const accessToken = await getAccessToken()
    const formData = new FormData()
    const fileBuffer = fs.readFileSync(req.file.path)
    const blob = new Blob([fileBuffer], { type: req.file.mimetype })
    
    formData.append('media', blob, req.file.originalname)
    formData.append('type', 'image')

    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=image`,
      {
        method: 'POST',
        body: formData
      }
    )

    const result = await response.json()
    
    // 删除临时文件
    fs.unlinkSync(req.file.path)

    if (result.media_id) {
      res.json({
        success: true,
        media_id: result.media_id,
        url: result.url
      })
    } else {
      throw new Error(result.errmsg || '上传到微信服务器失败')
    }
  } catch (error) {
    console.error('上传媒体文件失败:', error)
    res.status(500).json({ error: error.message })
  }
})

// 发布文章到微信公众号
app.post('/api/wechat/publish', async (req, res) => {
  try {
    const { title, content, author, digest, coverImage, publishType, scheduleTime } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' })
    }

    const accessToken = await getAccessToken()
    
    // 构建文章数据
    const articleData = {
      articles: [{
        title: title,
        author: author || '',
        digest: digest || '',
        content: content,
        content_source_url: '',
        thumb_media_id: coverImage || '', // 需要先上传封面图片获取media_id
        show_cover_pic: coverImage ? 1 : 0,
        need_open_comment: 1,
        only_fans_can_comment: 0
      }]
    }

    let apiUrl
    let method = 'POST'
    
    if (publishType === 'draft') {
      // 保存草稿
      apiUrl = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`
    } else if (publishType === 'publish') {
      // 立即发布
      apiUrl = `https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=${accessToken}`
    } else if (publishType === 'schedule') {
      // 定时发布 (需要先创建草稿，然后设置定时发布)
      apiUrl = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`
    }

    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleData)
    })

    const result = await response.json()

    if (result.errcode === 0) {
      res.json({
        success: true,
        message: publishType === 'draft' ? '草稿保存成功' : '文章发布成功',
        media_id: result.media_id,
        publish_id: result.publish_id
      })
    } else {
      throw new Error(result.errmsg || '发布失败')
    }
  } catch (error) {
    console.error('发布文章失败:', error)
    res.status(500).json({ error: error.message })
  }
})

// 获取发布状态
app.get('/api/wechat/publish-status/:publishId', async (req, res) => {
  try {
    const { publishId } = req.params
    const accessToken = await getAccessToken()

    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/freepublish/get?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publish_id: publishId })
      }
    )

    const result = await response.json()
    res.json(result)
  } catch (error) {
    console.error('获取发布状态失败:', error)
    res.status(500).json({ error: error.message })
  }
})

// 获取草稿列表
app.get('/api/wechat/drafts', async (req, res) => {
  try {
    const { offset = 0, count = 20 } = req.query
    const accessToken = await getAccessToken()

    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/draft/batchget?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          offset: parseInt(offset), 
          count: parseInt(count) 
        })
      }
    )

    const result = await response.json()
    res.json(result)
  } catch (error) {
    console.error('获取草稿列表失败:', error)
    res.status(500).json({ error: error.message })
  }
})

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error)
  res.status(500).json({ error: '服务器内部错误' })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log('API文档:')
  console.log('  GET  /api/health - 健康检查')
  console.log('  POST /api/upload - 上传图片')
  console.log('  POST /api/wechat/upload-media - 上传媒体到微信')
  console.log('  POST /api/wechat/publish - 发布文章')
  console.log('  GET  /api/wechat/publish-status/:publishId - 获取发布状态')
  console.log('  GET  /api/wechat/drafts - 获取草稿列表')
})

module.exports = app