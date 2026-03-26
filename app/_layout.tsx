import { Stack } from 'expo-router';

if (typeof document !== 'undefined') {
  const observer = new MutationObserver(() => {
    const expoReset = document.getElementById('expo-reset');
    if (expoReset && expoReset.innerHTML.includes('overflow:hidden')) {
      expoReset.innerHTML = '#root,body,html{height:auto;min-height:100%;}body{overflow:auto;}#root{display:flex;}';
    }
  });
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
}

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}