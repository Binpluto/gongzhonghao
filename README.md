# 微信公众号文章发布工具

一个专业的微信公众号文章编辑、排版和发布工具，支持Markdown编辑、实时预览、自动排版和一键发布。

## 功能特性

- 📝 **Markdown编辑器** - 基于Monaco Editor的专业代码编辑体验
- 👀 **实时预览** - 所见即所得的文章预览效果
- 🎨 **自动排版** - 针对微信公众号优化的样式排版
- 📱 **响应式设计** - 适配不同屏幕尺寸的现代化界面
- 🖼️ **图片管理** - 支持图片上传和封面设置
- 🚀 **一键发布** - 直接发布到微信公众号或保存为草稿
- ⏰ **定时发布** - 支持设置定时发布时间
- 📊 **文章统计** - 实时显示字数、阅读时间等统计信息

## 技术栈

### 前端
- React 18
- Vite
- Tailwind CSS
- Monaco Editor
- Marked (Markdown解析)
- DOMPurify (XSS防护)

### 后端
- Node.js
- Express
- Multer (文件上传)
- 微信公众号API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env`，并填入你的微信公众号配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
WECHAT_APP_ID=你的微信公众号AppID
WECHAT_APP_SECRET=你的微信公众号AppSecret
PORT=3001
```

### 3. 启动开发服务器

启动后端服务：
```bash
npm run server
```

启动前端开发服务器：
```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问 `http://localhost:3000`

## 微信公众号配置

### 获取AppID和AppSecret

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入「开发」->「基本配置」
3. 获取开发者ID(AppID)和开发者密码(AppSecret)
4. 将这些信息填入 `.env` 文件

### API权限说明

本工具需要以下微信公众号API权限：
- 素材管理权限（上传图片）
- 群发接口权限（发布文章）
- 草稿箱管理权限（保存草稿）

## 使用指南

### 1. 编写文章

- 在左侧编辑器中使用Markdown语法编写文章
- 右侧会实时预览渲染效果
- 支持标准Markdown语法：标题、段落、列表、链接、图片、代码块等

### 2. 设置文章信息

在右侧边栏中设置：
- 文章标题（必填）
- 作者信息
- 文章摘要
- 封面图片
- 发布选项

### 3. 发布文章

点击「发布到公众号」按钮，选择发布方式：
- **保存草稿** - 保存到微信公众号草稿箱
- **立即发布** - 立即推送给所有关注用户
- **定时发布** - 设置指定时间发布

## 项目结构

```
├── public/                 # 静态资源
├── src/                    # 前端源码
│   ├── components/         # React组件
│   │   ├── Header.jsx      # 头部组件
│   │   ├── Editor.jsx      # 编辑器组件
│   │   ├── Preview.jsx     # 预览组件
│   │   ├── Sidebar.jsx     # 侧边栏组件
│   │   └── PublishModal.jsx # 发布对话框
│   ├── App.jsx            # 主应用组件
│   ├── main.jsx           # 应用入口
│   └── index.css          # 全局样式
├── server/                # 后端服务
│   ├── index.js           # 服务器主文件
│   └── uploads/           # 上传文件目录
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── README.md             # 项目说明
```

## API接口

### 文件上传
```
POST /api/upload
```

### 发布文章
```
POST /api/wechat/publish
```

### 获取草稿列表
```
GET /api/wechat/drafts
```

### 获取发布状态
```
GET /api/wechat/publish-status/:publishId
```

## 开发说明

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 注意事项

1. **微信公众号限制**：
   - 个人订阅号无法使用高级接口
   - 服务号需要认证后才能使用发布接口
   - 每日发布次数有限制

2. **图片处理**：
   - 上传的图片会先保存到本地服务器
   - 发布时会上传到微信服务器获取media_id
   - 建议图片大小控制在2MB以内

3. **内容安全**：
   - 所有用户输入都经过XSS过滤
   - 遵循微信公众号内容规范
   - 避免敏感词汇和违规内容

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！