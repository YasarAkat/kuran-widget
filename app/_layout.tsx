import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      const root = document.getElementById('root');
      if (root) {
        root.style.overflow = 'auto';
        root.style.height = 'auto';
      }
    }
  }, []);

  return <Stack />;
}