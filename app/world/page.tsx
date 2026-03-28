// 强制使用客户端渲染（因为需要访问 Cookie 和 localStorage）
export const dynamic = 'force-dynamic';

import WorldContent from './WorldContent';

export default function WorldPage() {
  return <WorldContent />;
}
