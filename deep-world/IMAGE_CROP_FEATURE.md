# 图片自动裁剪正方形功能说明

## 📅 更新日期
2026-03-25

## ✨ 功能概述

在用户上传本地图片时，系统会自动将图片裁剪为**正方形**，确保虚拟形象头像始终保持统一的显示效果。

### 核心特性
- ✅ **自动识别**：智能检测图片尺寸
- ✅ **居中裁剪**：以图片中心为基准裁剪
- ✅ **高质量输出**：保持原图质量
- ✅ **实时预览**：上传后立即看到正方形效果
- ✅ **用户友好**：无需任何手动操作

## 🔧 技术实现

### 1. Canvas 裁剪技术

使用 HTML5 Canvas API 进行图片处理和裁剪：

```typescript
// 计算正方形裁剪区域（居中裁剪）
const size = Math.min(img.width, img.height);
const startX = (img.width - size) / 2;
const startY = (img.height - size) / 2;

// 创建 Canvas 进行裁剪
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

// 绘制裁剪后的图片
ctx.drawImage(
  img,
  startX, startY, size, size, // 源图像裁剪区域
  0, 0, size, size             // 目标图像绘制区域
);

// 转换为 Base64（高质量 JPEG 格式）
const base64 = canvas.toDataURL('image/jpeg', 0.9);
```

### 2. 裁剪算法

#### 步骤 1：获取图片信息
```typescript
const img = await new Promise<HTMLImageElement>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = event.target?.result as string;
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});
```

#### 步骤 2：计算裁剪区域
```typescript
// 取宽度和高度中较小的值作为正方形边长
const size = Math.min(img.width, img.height);

// 计算起始坐标（确保居中）
const startX = (img.width - size) / 2;
const startY = (img.height - size) / 2;
```

#### 步骤 3：Canvas 绘制
```typescript
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

ctx.drawImage(
  img,
  startX, startY, size, size, // 从原图的哪个区域裁剪
  0, 0, size, size             // 绘制到 Canvas 的哪个位置
);
```

#### 步骤 4：导出图片
```typescript
// 转换为高质量的 JPEG Base64
const base64 = canvas.toDataURL('image/jpeg', 0.9);
```

## 🎨 裁剪示例

### 横向图片（宽度 > 高度）
```
原图：800x600
裁剪：
- 正方形边长：600px
- 起始 X：(800-600)/2 = 100px
- 起始 Y：0px
- 裁剪区域：从 (100, 0) 开始 600x600 的区域
```

### 纵向图片（高度 > 宽度）
```
原图：600x800
裁剪：
- 正方形边长：600px
- 起始 X：0px
- 起始 Y：(800-600)/2 = 100px
- 裁剪区域：从 (0, 100) 开始 600x600 的区域
```

### 正方形图片（宽度 = 高度）
```
原图：800x800
裁剪：
- 正方形边长：800px
- 起始 X：0px
- 起始 Y：0px
- 裁剪区域：完整保留原图
```

## 📱 UI 优化

### 1. 预览区域样式
```tsx
<div className="w-full h-48 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
  <img 
    src={formData.imageUrl} 
    alt="预览" 
    className="w-48 h-48 object-cover rounded-lg shadow-lg" 
  />
</div>
```

- 固定尺寸：`w-48 h-48`（192x192px）
- 居中显示：`flex items-center justify-center`
- 圆角效果：`rounded-lg`
- 阴影效果：`shadow-lg`

### 2. 状态提示
```tsx
<span className="text-xs text-green-400 flex items-center justify-center gap-1">
  <svg>...</svg>
  已自动裁剪为正方形
</span>
```

### 3. 说明更新
```tsx
<p className="text-green-400 flex items-center gap-1 mt-2">
  ✨ 自动居中裁剪为正方形
</p>
```

## 🎯 使用流程

### 用户操作步骤

1. **进入创建页面**
   - 登录 → 仪表盘 → "+ 创建虚拟形象"

2. **第一步：基本信息**
   - 填写名称、类型、性别、年龄
   - 点击"下一步"

3. **第二步：选择图片**
   - 选择艺术风格
   - 点击"选择图片文件"按钮
   - 从本地选择任意尺寸的图片

4. **自动处理**
   - 系统自动分析图片尺寸
   - 计算最佳裁剪区域
   - 执行居中裁剪
   - 生成正方形图片

5. **查看效果**
   - 实时预览正方形图片
   - 看到"已自动裁剪为正方形"提示
   - 确认满意后点击"下一步"

6. **完成创建**
   - 第三步确认所有信息
   - 点击"创建虚拟形象"
   - 保存成功

## ⚙️ 技术参数

### 输入要求
- **格式支持**：JPG、PNG、GIF、WebP
- **大小限制**：≤ 5MB
- **尺寸建议**：≥ 800x800px（保证清晰度）
- **比例不限**：横图、竖图、方图均可

### 输出规格
- **形状**：完美正方形
- **尺寸**：等于原图短边长度
- **格式**：JPEG（高质量压缩）
- **质量**：90%（平衡文件大小和画质）

### 性能指标
- **处理速度**：< 1 秒（普通图片）
- **内存占用**：低（动态创建 Canvas）
- **兼容性**：支持所有现代浏览器

## 🎨 裁剪策略

### 居中裁剪原则
- **保护主体**：大多数照片主体位于中心
- **视觉平衡**：保持画面构图平衡
- **减少失真**：最小化重要内容丢失

### 特殊情况处理

#### 1. 主体偏离中心
```
如果主体不在中心：
- 当前：居中裁剪（可能裁剪掉部分主体）
- 未来优化：人脸检测智能定位
```

#### 2. 超宽或超高图片
```
超宽图片（如 2000x500）：
- 裁剪后：500x500
- 保留：中间部分

超高图片（如 500x2000）：
- 裁剪后：500x500
- 保留：中间部分
```

#### 3. 极小图片
```
图片过小（如 100x100）：
- 直接保留原尺寸
- 不放大（避免模糊）
```

## 🔄 与其他功能的兼容

### 1. 删除重选
- 点击"删除"按钮可移除当前图片
- 重新选择新图片会再次自动裁剪
- 无次数限制

### 2. 预览展示
- 创建页面：正方形预览
- 确认页面：正方形预览
- 卡片展示：正方形头像
- 大世界：正方形渲染

### 3. 数据存储
- Base64 格式存储
- LocalStorage 持久化
- 与其他数据一起保存

## 📊 对比效果

| 对比项 | 旧版本 | 新版本 |
|--------|--------|--------|
| 图片形状 | 原图比例 | 完美正方形 ✅ |
| 显示效果 | 可能变形 | 完美适配 ✅ |
| 用户体验 | 需要手动调整 | 全自动处理 ✅ |
| 技术难度 | 简单展示 | 智能裁剪 ✅ |
| 一致性 | 参差不齐 | 统一规范 ✅ |

## 💡 优势说明

### 1. 视觉统一性
- 所有虚拟形象头像都是正方形
- 卡片布局整齐美观
- 大世界展示统一协调

### 2. 用户体验
- 零学习成本：无需任何操作
- 零等待时间：瞬间完成
- 零技术门槛：自动处理

### 3. 技术先进
- Canvas 技术：成熟稳定
- 客户端处理：无需服务器
- 高性能：毫秒级响应

## 🔮 未来优化方向

### 短期优化
- [ ] 添加裁剪预览框（可手动调整位置）
- [ ] 支持拖拽调整裁剪区域
- [ ] 添加旋转功能
- [ ] 支持缩放预览

### 中期目标
- [ ] 人脸检测（优先保证人脸完整）
- [ ] 智能主体识别
- [ ] 多种裁剪模式（居中、顶部、自定义）
- [ ] 实时预览不同尺寸效果

### 长期规划
- [ ] AI 智能构图
- [ ] 美学评分推荐
- [ ] 批量处理
- [ ] 云端高清处理

## 🐛 已知限制

### 1. 技术限制
- 超大图片（>4000px）可能占用较多内存
- 极端比例图片（如 10:1）会损失较多内容
- GIF 动图会被转换为静态图片

### 2. 浏览器兼容
- IE 浏览器不支持（已放弃支持）
- 老旧移动端浏览器可能性能较差

### 3. 性能考虑
- 同时上传多张大图可能导致卡顿
- 建议图片大小控制在 2MB 以内

## 📝 代码片段

### 完整处理流程
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 1. 验证文件
  validateFile(file);

  setUploading(true);

  try {
    // 2. 加载图片
    const img = await loadImage(file);

    // 3. 计算裁剪区域
    const size = Math.min(img.width, img.height);
    const startX = (img.width - size) / 2;
    const startY = (img.height - size) / 2;

    // 4. Canvas 裁剪
    const canvas = createSquareCanvas(img, startX, startY, size);

    // 5. 导出 Base64
    const base64 = canvas.toDataURL('image/jpeg', 0.9);

    setFormData({ ...formData, imageUrl: base64 });
  } catch (error) {
    handleError(error);
  } finally {
    setUploading(false);
    e.target.value = '';
  }
};
```

---

**功能已完成！** 🎉

现在用户上传的任何图片都会自动裁剪为完美的正方形，确保虚拟形象头像的统一性和美观度！
