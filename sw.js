// 🚀 Typing Pro Service Worker
// Performance optimization and offline functionality

const CACHE_NAME = 'typing-pro-v2.0.0';
const STATIC_CACHE = 'typing-pro-static-v2.0.0';
const DYNAMIC_CACHE = 'typing-pro-dynamic-v2.0.0';

// Critical resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/404.html',
    '/sitemap.xml',
    '/robots.txt'
];

// Dynamic resources to cache on demand
const DYNAMIC_ASSETS = [
    '/docs/',
    '/docs/API.html',
    '/docs/README.html'
];

// Performance: Install event - cache critical resources
self.addEventListener('install', event => {
    console.log('🚀 Typing Pro Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                // Performance: Skip waiting to activate immediately
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Failed to cache static assets:', error);
            })
    );
});

// Performance: Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🔄 Typing Pro Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Performance: Remove old caches
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Removing old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated successfully');
                // Performance: Claim all clients immediately
                return self.clients.claim();
            })
    );
});

// Performance: Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Performance: Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Performance: Skip non-HTTP requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Performance: Handle different types of requests
    if (STATIC_ASSETS.includes(url.pathname)) {
        // Performance: Serve static assets from cache first
        event.respondWith(serveFromCache(request, STATIC_CACHE));
    } else if (DYNAMIC_ASSETS.some(path => url.pathname.startsWith(path))) {
        // Performance: Serve dynamic assets with network fallback
        event.respondWith(serveWithNetworkFallback(request, DYNAMIC_CACHE));
    } else if (request.destination === 'image') {
        // Performance: Cache images on demand
        event.respondWith(cacheImage(request));
    } else {
        // Performance: Network first for other requests
        event.respondWith(networkFirst(request));
    }
});

// Performance: Serve static assets from cache
async function serveFromCache(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Serving from cache:', request.url);
            return cachedResponse;
        }
        
        // Performance: Fallback to network if not in cache
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Performance: Cache for future use
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('❌ Error serving from cache:', error);
        // Performance: Return offline page if everything fails
        return caches.match('/404.html');
    }
}

// Performance: Serve with network fallback
async function serveWithNetworkFallback(request, cacheName) {
    try {
        // Performance: Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Performance: Cache successful responses
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', request.url);
        // Performance: Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Performance: Return offline page if everything fails
        return caches.match('/404.html');
    }
}

// Performance: Cache images on demand
async function cacheImage(request) {
    try {
        // Performance: Try cache first for images
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Performance: Fetch and cache if not in cache
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('❌ Error caching image:', error);
        // Performance: Return a placeholder image if available
        return caches.match('/placeholder-image.png');
    }
}

// Performance: Network first strategy
async function networkFirst(request) {
    try {
        // Performance: Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Performance: Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', request.url);
        // Performance: Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Performance: Return offline page if everything fails
        return caches.match('/404.html');
    }
}

// Performance: Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'typing-test-sync') {
        event.waitUntil(syncTypingTestData());
    }
});

// Performance: Sync typing test data when online
async function syncTypingTestData() {
    try {
        // Performance: Get stored offline data
        const offlineData = await getOfflineData();
        
        if (offlineData && offlineData.length > 0) {
            console.log('📊 Syncing offline typing test data...');
            
            // Performance: Send data to server
            const response = await fetch('/api/sync-typing-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offlineData)
            });
            
            if (response.ok) {
                console.log('✅ Typing test data synced successfully');
                // Performance: Clear offline data after successful sync
                await clearOfflineData();
            }
        }
    } catch (error) {
        console.error('❌ Error syncing typing test data:', error);
    }
}

// Performance: Get offline data from IndexedDB
async function getOfflineData() {
    // Performance: Implementation depends on your data storage strategy
    // This is a placeholder for the actual implementation
    return [];
}

// Performance: Clear offline data
async function clearOfflineData() {
    // Performance: Implementation depends on your data storage strategy
    // This is a placeholder for the actual implementation
    console.log('🗑️ Offline data cleared');
}

// Performance: Handle push notifications
self.addEventListener('push', event => {
    console.log('📱 Push notification received:', event);
    
    if (event.data) {
        const data = event.data.json();
        
        // Performance: Show notification
        const options = {
            body: data.body || 'New typing challenge available!',
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Take Test',
                    icon: '/icon-192x192.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/icon-192x192.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Typing Pro', options)
        );
    }
});

// Performance: Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('👆 Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Performance: Open typing test
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Performance: Just close the notification
        event.notification.close();
    } else {
        // Performance: Default action - open typing test
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Performance: Handle message events from main thread
self.addEventListener('message', event => {
    console.log('💬 Message received in Service Worker:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        // Performance: Skip waiting and activate immediately
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        // Performance: Cache specific URLs
        event.waitUntil(cacheUrls(event.data.urls));
    }
});

// Performance: Cache specific URLs
async function cacheUrls(urls) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const promises = urls.map(url => {
            return fetch(url)
                .then(response => {
                    if (response.ok) {
                        return cache.put(url, response);
                    }
                })
                .catch(error => {
                    console.error('❌ Error caching URL:', url, error);
                });
        });
        
        await Promise.all(promises);
        console.log('✅ URLs cached successfully');
    } catch (error) {
        console.error('❌ Error caching URLs:', error);
    }
}

console.log('🚀 Typing Pro Service Worker loaded successfully!');
