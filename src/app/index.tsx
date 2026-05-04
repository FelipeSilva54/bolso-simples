import { Redirect } from 'expo-router';
import { useAuth } from '@/src/store/AuthContext';
import { Spinner } from '@/src/components/ui/spinner';
import { Box } from '@/src/components/ui/box';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box className="flex-1 items-center justify-center bg-background-0">
        <Spinner size="large" />
      </Box>
    );
  }

  return <Redirect href={user ? '/(tabs)' : '/login'} />;
}
