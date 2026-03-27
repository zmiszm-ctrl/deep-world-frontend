'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, addAvatar, generateId, getRandomStatus, getRandomPersonality, generateAIMessage } from '@/lib/storage';
import { Avatar } from '@/types';

export default function CreateAvatarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'person' as 'person' | 'animal' | 'virtual',
    style: 'anime' as 'anime' | 'cartoon' | 'realistic' | 'pixel',
    gender: 'male' as 'male' | 'female' | 'other',
    age: 18,
    imageUrl: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('不支持的文件格式，请选择 JPG、PNG、GIF 或 WebP 格式');
      return;
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小超过 5MB 限制');
      return;
    }

    setUploading(true);

    try {
      // 创建 Image 对象用于处理
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

      // 计算正方形裁剪区域（居中裁剪）
      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;

      // 创建 Canvas 进行裁剪
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法获取 Canvas 上下文');
      }

      // 绘制裁剪后的图片
      ctx.drawImage(
        img,
        startX, startY, size, size, // 源图像裁剪区域
        0, 0, size, size             // 目标图像绘制区域
      );

      // 转换为 Base64（高质量 JPEG 格式）
      const base64 = canvas.toDataURL('image/jpeg', 0.9);

      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFormData({ ...formData, imageUrl: base64 });
    } catch (error) {
      console.error('图片上传失败:', error);
      alert('图片上传失败，请重试');
    } finally {
      setUploading(false);
      // 清空 input value，允许重复选择同一文件
      e.target.value = '';
    }
  };

  const handleSubmit = () => {
    const user = getUser();
    if (!user) return;

    // 检查是否超过限制（最多 2 个）
    const avatars = JSON.parse(localStorage.getItem('deep-world-data') || '{"avatars":[]}').avatars;
    if (avatars.length >= 2) {
      alert('每个账户最多创建 2 个虚拟形象');
      return;
    }

    const newAvatar: Avatar = {
      id: generateId(),
      userId: user.id,
      name: formData.name,
      type: formData.type,
      style: formData.style,
      gender: formData.gender,
      age: formData.age,
      imageUrl: formData.imageUrl,
      currentStatus: getRandomStatus(),
      currentMessage: generateAIMessage(getRandomPersonality().name),
      personality: getRandomPersonality(),
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addAvatar(newAvatar);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
        >
          ← 返回
        </button>

        {/* 进度条 */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-indigo-400 bg-indigo-400/20' : 'border-gray-500'}`}>
                1
              </div>
              <span className="ml-2 font-medium">基本信息</span>
            </div>
            
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-400' : 'bg-gray-600'}`} />
            
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-indigo-400 bg-indigo-400/20' : 'border-gray-500'}`}>
                2
              </div>
              <span className="ml-2 font-medium">外观设置</span>
            </div>
            
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-indigo-400' : 'bg-gray-600'}`} />
            
            <div className={`flex items-center ${step >= 3 ? 'text-indigo-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-indigo-400 bg-indigo-400/20' : 'border-gray-500'}`}>
                3
              </div>
              <span className="ml-2 font-medium">确认创建</span>
            </div>
          </div>
        </div>

        {/* 表单内容 */}
        <div className="glass-card p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">基本信息</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  形象名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-400 text-white"
                  placeholder="给你的虚拟形象起个名字"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  形象类型 *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'person', label: '人物', icon: '👤' },
                    { value: 'animal', label: '动物', icon: '🐾' },
                    { value: 'virtual', label: '虚拟生命', icon: '🌟' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setFormData({ ...formData, type: item.value as any })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === item.value
                          ? 'border-indigo-400 bg-indigo-400/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  性别
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'male', label: '男' },
                    { value: 'female', label: '女' },
                    { value: 'other', label: '其他' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setFormData({ ...formData, gender: item.value as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.gender === item.value
                          ? 'border-indigo-400 bg-indigo-400/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  年龄
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-400 text-white"
                  min="0"
                  max="150"
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.name}
                className="gradient-btn w-full py-4 text-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">外观设置</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  艺术风格 *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'anime', label: '动漫', icon: '🎨' },
                    { value: 'cartoon', label: '动画', icon: '🎬' },
                    { value: 'realistic', label: '写实', icon: '📷' },
                    { value: 'pixel', label: '像素风', icon: '👾' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setFormData({ ...formData, style: item.value as any })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.style === item.value
                          ? 'border-indigo-400 bg-indigo-400/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="font-medium text-white">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  上传图片（可选）
                </label>
                <div className="space-y-4">
                  {/* 上传按钮 */}
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`gradient-btn w-full py-4 text-lg flex items-center justify-center gap-3 cursor-pointer ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>上传中...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>选择图片文件</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* 已上传图片预览 */}
                  {formData.imageUrl && (
                    <div className="glass-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">已选择的图片：</span>
                        <button
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          删除
                        </button>
                      </div>
                      <div className="w-full h-48 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={formData.imageUrl} 
                          alt="预览" 
                          className="w-48 h-48 object-cover rounded-lg shadow-lg" 
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-xs text-green-400 flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          已自动裁剪为正方形
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 上传说明 */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">💡</span>
                      <div className="text-sm text-blue-400 space-y-1">
                        <p>支持格式：JPG、PNG、GIF、WebP</p>
                        <p>文件大小：最大 5MB</p>
                        <p>建议尺寸：800x800 像素或更高</p>
                        <p className="text-green-400 flex items-center gap-1 mt-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          ✨ 自动居中裁剪为正方形
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-4 border border-white/20 rounded-lg text-white hover:bg-white/5">
                  上一步
                </button>
                <button onClick={handleNext} className="gradient-btn flex-1 py-4">
                  下一步
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">确认创建</h2>
              
              <div className="glass-card p-6 space-y-4">
                <div>
                  <div className="text-sm text-gray-400">名称</div>
                  <div className="text-lg font-semibold text-white">{formData.name}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">类型</div>
                    <div className="text-white capitalize">
                      {formData.type === 'person' ? '人物' : formData.type === 'animal' ? '动物' : '虚拟生命'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">风格</div>
                    <div className="text-white capitalize">
                      {formData.style === 'anime' ? '动漫' : formData.style === 'cartoon' ? '动画' : formData.style === 'realistic' ? '写实' : '像素风'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">性别</div>
                    <div className="text-white">
                      {formData.gender === 'male' ? '男' : formData.gender === 'female' ? '女' : '其他'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">年龄</div>
                    <div className="text-white">{formData.age}岁</div>
                  </div>
                </div>

                {formData.imageUrl && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">预览</div>
                    <div className="w-full h-48 bg-white/5 rounded-lg overflow-hidden">
                      <img src={formData.imageUrl} alt="预览" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-4 border border-white/20 rounded-lg text-white hover:bg-white/5">
                  上一步
                </button>
                <button onClick={handleSubmit} className="gradient-btn flex-1 py-4">
                  创建虚拟形象
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
