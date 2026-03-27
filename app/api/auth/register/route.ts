import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少 6 位' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    console.log('📝 开始创建用户:', email);

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname: nickname || email.split('@')[0],
        points: 10, // 初始 10 积分
      },
    });

    console.log('✅ 用户创建成功:', user.id);

    // 生成 Token
    const token = await generateToken(user.id);

    // 创建响应并设置 Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        points: user.points,
      },
    });

    // 设置 HTTP-only Cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 天
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
