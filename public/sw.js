self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Avoid intercepting development/Next.js HMR or build-related files
  if (event.request.url.includes('_next') || event.request.url.includes('webpack')) {
    return;
  }

  // Handle navigate (page) requests gracefully with an offline page fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.warn('SW: Fetch failed for page navigation, returning fallback offline response', error);
        return new Response(
          `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sin Conexión - VamosJuntos</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: #05070a;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
      padding: 20px;
    }
    h1 { color: #8b5cf6; margin-bottom: 10px; }
    p { color: #9ca3af; margin-bottom: 20px; max-width: 400px; }
    button {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Parece que estás desconectado</h1>
  <p>Por favor, comprueba tu conexión a internet e inténtalo de nuevo.</p>
  <button onclick="window.location.reload()">Reintentar</button>
</body>
</html>`,
          {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          }
        );
      })
    );
  }
});
