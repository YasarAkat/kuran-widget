import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Tüm olası elementleri zorla override et
      const style = document.createElement('style');
      style.innerHTML = `
        html, body, #root {
          overflow: auto !important;
          height: auto !important;
          min-height: 100% !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return <Stack />;
}