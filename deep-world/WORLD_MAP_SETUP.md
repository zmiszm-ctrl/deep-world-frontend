# 世界地图背景图片设置指南

## 📸 需要的操作

### 1. 准备地图图片

请将您提供的世界地图图片保存到以下位置：

```
deep-world/public/world-map.jpg
```

### 2. 图片要求

- **格式**：JPG 或 PNG
- **推荐尺寸**：1920x1080 或更高
- **文件大小**：建议小于 500KB（优化加载速度）
- **内容**：卡通风格的游戏地图

### 3. 文件命名

- 主要使用：`world-map.jpg`
- 也支持：`world-map.png`、`world-bg.jpg` 等

### 4. 如何添加图片

#### 方法一：直接复制文件

1. 打开 Finder（Mac）或文件资源管理器（Windows）
2. 导航到：`/Users/aizning/Documents/cursor file/deep-world-frontend/deep-world/public/`
3. 将您的地图图片拖入该文件夹
4. 重命名为 `world-map.jpg`

#### 方法二：使用命令行

```bash
# 进入 public 目录
cd /Users/aizning/Documents/cursor\ file/deep-world-frontend/deep-world/public

# 复制您的图片文件（替换为您的实际路径）
cp /path/to/your/map-image.jpg world-map.jpg
```

### 5. 验证是否成功

1. 确保开发服务器正在运行：`npm run dev`
2. 访问：http://localhost:3000/world
3. 应该能看到新的地图背景

---

##  当前效果说明

### 已完成的修改

1. **状态展示位置调整**
   - ✅ 从头顶移到名字下方
   - ✅ 格式：名字 + 状态图标 + 状态名称
   - ✅ 字体缩小（名字 10px，状态 9px）

2. **背景替换**
   - ✅ 移除渐变背景
   - ✅ 移除网格图案
   - ✅ 使用图片背景（需添加实际图片）
   - ✅ 添加半透明遮罩层（让虚拟形象更清晰）

### 视觉效果

```
┌─────────────────────────┐
│    [虚拟形象图标]        │
│    ┌──────────┐          │
│    │  冒险者 5  │  ← 名字 │
│    ├──────────┤          │
│    │ 😊 开心   │  ← 状态 │
│    └──────────┘          │
│                          │
│   💬 游戏对话气泡         │
│  (仅选中时显示在头顶)     │
└─────────────────────────┘
```

---

## 🔧 技术实现

### 代码结构

```tsx
<div className="虚拟形象容器">
  {/* 图标 */}
  <div className="w-10 h-10 rounded-full">👤</div>
  
  {/* 信息区域 */}
  <div className="mt-1 text-center space-y-0.5">
    {/* 名字标签 */}
    <div className="text-[10px]">冒险者 5</div>
    
    {/* 状态标签 */}
    <div className="text-[9px]">😊 开心</div>
  </div>
  
  {/* AI 对话气泡（仅选中时显示） */}
  {selected && <div className="对话气泡">...</div>}
</div>
```

### 背景样式

```css
background: url(/world-map.jpg) center/cover no-repeat;
background-color: #1e1b4b; /* 备用背景色 */
```

---

## 📝 注意事项

1. **图片路径**：必须是 `/public/world-map.jpg`，因为 Next.js 会将 public 目录作为静态资源根目录
2. **命名规范**：使用小写字母和连字符，避免空格
3. **性能优化**：如果图片太大，建议使用在线工具压缩（如 TinyPNG）
4. **响应式**：图片会使用 `cover` 模式自动适配容器大小

---

##  下一步

添加图片后，您可以：

1. 刷新浏览器查看新效果
2. 调整遮罩层透明度（当前为 `bg-black/20`）
3. 如需更换图片，直接替换 `world-map.jpg` 即可

---

**添加完图片后，请刷新浏览器查看效果！** ✨
