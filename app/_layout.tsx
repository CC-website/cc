import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from '../types';
import NotFoundScreen from '../src/screens/NotFoundScreen';
import DrawerNavigator from '../src/navigation/DrawerNavigator';
import TabStackLayout from './(tabs)/_layout';
import ModalScreen from './modal';
import AuthRequiredPage from './auth/AuthRequiredPage';
import AuthLayout from './auth/_layout';
import AuthContext from './AuthContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
         name="(tabs)"
         component={TabStackLayout}
         options={{ headerShown: false }}
         />
        <Stack.Screen 
        name="modal"
        component={ModalScreen}
        options={{ title: "Oops!" }}
        />
        <Stack.Screen
         name="auth"
         component={AuthLayout}
         options={{ headerShown: false }}
         />
         <Stack.Screen
         name="AuthContext"
         component={AuthContext}
         options={{ headerShown: false }}
         />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
