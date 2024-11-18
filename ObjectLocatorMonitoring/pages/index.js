import { Stack } from 'expo-router';
import DashboardScreen from './dashboard';
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" component={DashboardScreen} options={{ header: 'false' }} />
    </Stack>
  );
}
