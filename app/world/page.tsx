// 强制在静态生成时跳过 SSR
export const dynamic = 'force-static';

import WorldContent from './WorldContent';

export default function WorldPage() {
  return <WorldContent />;
}
