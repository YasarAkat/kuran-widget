import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const fix = () => {
        const expoReset = document.getElementById('expo-reset');
        if (expoReset) {
          expoReset.innerHTML = `
            #root,body,html{height:auto;min-height:100%;}
            body{overflow:auto;}
            #root{display:flex;}
          `;
        }
      };
      fix();
      setTimeout(fix, 100);
      setTimeout(fix, 500);
    }
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}