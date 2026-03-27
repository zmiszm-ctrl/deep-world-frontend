import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// 获取用户的所有虚拟形象
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const avatars = await db.avatar.findMany({
      where: { userId: currentUser.id },
      include: {
        status: true,
        personality: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ avatars });
  } catch (error) {
    console.error('获取虚拟形象失败:', error);
    return NextResponse.json(
      { error: '获取虚拟形象失败' },
      { status: 500 }
    );
  }
}

// 创建虚拟形象
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, type, style, gender, age, imageUrl, personalityId } = body;

    // 验证必填字段
    if (!name || !type || !style || !gender || !age || !imageUrl || !personalityId) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 获取第一个状态作为初始状态（开心）
    const defaultStatus = await db.status.findFirst({
      where: { name: '开心' },
    });

    if (!defaultStatus) {
      return NextResponse.json(
        { error: '系统状态配置错误' },
        { status: 500 }
      );
    }

    // 创建虚拟形象
    const avatar = await db.avatar.create({
      data: {
        userId: currentUser.id,
        name,
        type,
        style,
        gender,
        age,
        imageUrl,
        statusId: defaultStatus.id,
        personalityId,
        currentMessage: '你好呀！很高兴见到你~',
        positionX: 50,
        positionY: 50,
      },
      include: {
        status: true,
        personality: true,
      },
    });

    return NextResponse.json({ avatar }, { status: 201 });
  } catch (error) {
    console.error('创建虚拟形象失败:', error);
    return NextResponse.json(
      { error: '创建虚拟形象失败' },
      { status: 500 }
    );
  }
}
