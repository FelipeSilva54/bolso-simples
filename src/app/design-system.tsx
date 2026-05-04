import { DesignSystemNavigator } from '@/src/screens/dev/DesignSystemNavigator';

export default function DesignSystemRoute() {
  if (!__DEV__) return null;
  return <DesignSystemNavigator />;
}
