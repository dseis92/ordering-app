export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

// Request notification permission (for push notifications)
export async function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

// Check if app is installed as PWA
export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Prompt to install PWA
export function promptInstall() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;

    // Return the deferred prompt to be used by UI
    return deferredPrompt;
  });

  return {
    show: async () => {
      if (!deferredPrompt) {
        return null;
      }

      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the deferred prompt
      deferredPrompt = null;

      return outcome;
    }
  };
}
