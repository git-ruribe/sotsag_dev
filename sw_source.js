console.log('Hello from sw.js v0.1.1');

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.2/workbox-sw.js");

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.suppressWarnings();  
workbox.precaching.precacheAndRoute([]);

workbox.googleAnalytics.initialize({
  parameterOverrides: {
    cd1: 'offline',
  },
});

