# 数字飞升世界 (Deep World)

一个基于 Web 的虚拟数字形象互动平台，用户可上传、创建专属虚拟形象（人物/动物/虚拟生命），形象具备 AI 自主行为、社交、状态变化能力，搭配趣味玩法与积分体系，打造"活的虚拟世界"。

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 产品特色

### 🎯 核心定位
- **AI 驱动的虚拟形象**：每个虚拟形象都具备自主行为和情感表达
- **沉浸式互动体验**：实时状态更新、AI 对话、社交互动
- **低门槛登录**：支持微信扫码快速登录
- **个性化创建**：支持人物/动物/虚拟生命三种类型，多种艺术风格可选

### 🎮 核心玩法

#### 1️⃣ 状态随机派送
系统每 **1 小时** 为每个虚拟形象随机分配 1 种状态，显示在形象头顶：
- 😊 开心 - 心情愉悦
- 😴 困倦 - 想要睡觉
- 😋 饥饿 - 需要进食
- 🎉 兴奋 - 充满活力
- 🤔 思考 - 深度思考中
- 🏃 运动 - 正在运动
- 💬 社交 - 与他人互动
- 📚 学习 - 学习中

#### 2️⃣ 积分投喂系统
- 新用户登录即送 **10 积分**
- 使用积分兑换食物投喂虚拟形象
- 不同食物有不同效果和价格
- 投喂后虚拟形象会产生相应反馈

| 食物 | 价格 | 效果 |
|------|------|------|
| 🍎 苹果 | 2 积分 | 恢复体力 |
| 🍔 汉堡 | 5 积分 | 大幅增加体力 |
| 🍰 蛋糕 | 3 积分 | 提升心情 |
| ☕ 咖啡 | 4 积分 | 提神醒脑 |
| 🥗 水果沙拉 | 6 积分 | 健康营养 |

#### 3️⃣ AI 自动语句
- 基于虚拟形象性格，AI 生成 100+ 句风格化日常用语
- 每 **3 分钟** 自动切换一句话，显示在形象头顶
- 5 种性格类型：活泼开朗、冷静理智、温柔善良、神秘高冷、幽默风趣

#### 4️⃣ 大地图社交
- 所有虚拟形象在大地图自由移动
- AI 自主社交行为，模拟真实互动
- 点击地图任意位置移动虚拟形象
- 与其他用户的虚拟形象聚集聊天

## 🛠️ 技术栈

### 前端框架
- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Tailwind CSS** - 实用优先的 CSS 框架

### 状态管理
- **LocalStorage** - 本地数据存储（演示用途）
- **React Hooks** - useState, useEffect, useRef

### 核心特性
- ✅ 响应式设计 - 支持桌面端和移动端
- ✅ 玻璃拟态 UI - 现代化设计风格
- ✅ 渐变动画 - 流畅的视觉体验
- ✅ 实时交互 - 即时响应用户操作

## 📦 项目结构

```
deep-world/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 首页（重定向到登录页）
│   ├── login/               # 登录页面
│   │   └── page.tsx
│   ├── dashboard/           # 用户仪表盘
│   │   └── page.tsx
│   ├── create-avatar/       # 创建虚拟形象
│   │   └── page.tsx
│   ├── feed/                # 投喂页面
│   │   └── [avatar]/        # 动态路由
│   │       └── page.tsx
│   └── world/               # 大世界页面
│       └── page.tsx
├── components/              # React 组件
│   └── AvatarCard.tsx      # 虚拟形象卡片组件
├── lib/                     # 工具库
│   └── storage.ts          # 本地存储操作
├── types/                   # TypeScript 类型定义
│   └── index.ts            # 统一导出
├── app/
│   ├── globals.css         # 全局样式
│   └── layout.tsx          # 根布局
├── package.json            # 项目依赖
└── tsconfig.json          # TypeScript 配置
```

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd deep-world-frontend/deep-world
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev

cd /Users/aizning/Documents/cursor\ file/deep-world-frontend/deep-world && npm run dev
```

4. **访问应用**
打开浏览器访问：`http://localhost:3000`

### 构建生产版本

```bash
npm run build
npm start
```

## 📱 功能模块详解

### 1. 用户登录模块
- 邮箱注册即可
- 自动生成用户 ID 和昵称
- 初始赠送 10 积分
- 记录登录时间

### 2. 虚拟形象管理模块

#### 形象创建流程
1. **基本信息**：名称、类型（人物/动物/虚拟生命）、性别、年龄
2. **外观设置**：艺术风格（动漫/动画/写实/像素风）、图片 URL
3. **确认创建**：预览并确认信息

#### 限制规则
- 单账户最多创建 2 个虚拟形象
- 必须包含 1 个人物形象和 1 个非人物形象

#### 属性设置
- **名字**：自定义命名
- **性别**：男/女/其他
- **初始年龄**：0-150 岁可调
- **类型**：人物👤、动物🐾、虚拟生命🌟
- **风格**：动漫🎨、动画🎬、写实📷、像素风👾

### 3. 核心互动玩法模块

#### 状态系统
- 8 种预设状态随机分配
- 每小时自动更新
- 状态气泡实时显示

#### 积分系统
- 初始积分：10 分
- 投喂消耗积分
- 积分不足时无法投喂
- 实时显示当前积分

#### AI 对话系统
- 基于性格生成对话
- 每种性格 20+ 条预设语句
- 3 分钟自动轮换
- 语句带有 emoji 表情

### 4. 大世界互动模块
- 网格化地图坐标系统
- 点击移动机制
- AI 自主移动模拟
- 多虚拟形象同屏展示

## 🎨 设计规范

### 配色方案
```css
--background: #0a0e27;      /* 深蓝背景 */
--foreground: #e4e7ff;      /* 浅紫前景 */
--primary: #6366f1;         /* 靛蓝色 */
--secondary: #8b5cf6;       /* 紫色 */
--accent: #ec4899;          /* 粉色 */
```

### 组件样式
- **玻璃拟态卡片**：半透明背景 + 模糊效果 + 边框光晕
- **渐变按钮**：线性渐变 + 阴影 + 悬停动画
- **状态气泡**：浮动动画 + 圆角设计
- **消息气泡**：渐变色 + 定位显示

## 🔧 配置说明

### TypeScript 配置
项目已配置完整的 TypeScript 类型检查，所有代码均有类型定义。

### Tailwind CSS 配置
使用 CSS Variables 实现主题色，支持深色模式。

### 本地存储
数据存储在 `localStorage`，键名为 `deep-world-data`。

数据结构：
```typescript
interface StorageData {
  user: User | null;
  avatars: Avatar[];
  pointsLogs: PointsLog[];
}
```

## 📝 API 参考

### 存储相关函数

```typescript
// 获取用户信息
getUser(): User | null

// 设置用户信息
setUser(user: User): void

// 获取所有虚拟形象
getAvatars(): Avatar[]

// 添加虚拟形象
addAvatar(avatar: Avatar): void

// 更新虚拟形象
updateAvatar(avatarId: string, updates: Partial<Avatar>): void

// 删除虚拟形象
deleteAvatar(avatarId: string): void
```

### 工具函数

```typescript
// 生成唯一 ID
generateId(): string

// 获取随机状态
getRandomStatus(): Status

// 获取随机性格
getRandomPersonality(): Personality

// 生成 AI 消息
generateAIMessage(personalityName: string): string

// 投喂虚拟形象
feedAvatar(avatarId: string, foodId: string): boolean
```

## 🌟 未来规划

### 短期目标
- [ ] 接入真实微信登录 API
- [ ] 后端数据库集成
- [ ] 用户头像上传功能
- [ ] 更多食物和道具

### 中期目标
- [ ] 虚拟形象之间的自动社交
- [ ] 积分任务和奖励系统
- [ ] 虚拟形象装扮系统
- [ ] 好友系统

### 长期目标
- [ ] 接入大语言模型实现真实 AI 对话
- [ ] 3D 虚拟形象支持
- [ ] 多人在线互动场景
- [ ] 虚拟货币和经济系统

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

MIT License

## 👥 团队

产品设计 & 开发 - Deep World Team

## 🙏 致谢

感谢以下开源项目：
- Next.js
- TypeScript
- Tailwind CSS
- React

---

**注意**：本项目为演示版本，使用 LocalStorage 存储数据。生产环境需要部署后端服务和数据库。
