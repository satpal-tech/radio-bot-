const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const radioUrl = 'https://eu1.fastcast4u.com/proxy/satpal?mp=/1';

// ਇੱਥੇ ਆਪਣੀਆਂ 20 USA ਪ੍ਰੌਕਸੀਆਂ (IP:PORT) ਪਾਓ
const usaProxies = [
    'http://45.55.35.22:80',   
    'http://138.197.148.2:80',  
    // ਤੁਸੀਂ ਹੋਰ ਪ੍ਰੌਕਸੀਆਂ ਵੀ ਇਸੇ ਤਰ੍ਹਾਂ ਲਾਈਨਾਂ ਬਣਾ ਕੇ ਜੋੜ ਸਕਦੇ ਹੋ
];

const listenersCount = 20; 
const durationInMinutes = 120; // 2 ਘੰਟੇ

console.log(`ਬੋਟ ਚਾਲੂ ਹੋ ਗਿਆ ਹੈ। ${listenersCount} USA ਲਿਸਨਰ ਕਨੈਕਟ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...`);
let activeConnections = [];

async function startListener(proxyUrl, index) {
    try {
        const agent = new HttpsProxyAgent(proxyUrl);
        const response = await axios({
            method: 'get',
            url: radioUrl,
            responseType: 'stream',
            httpsAgent: agent,
            timeout: 0
        });

        activeConnections.push(response.data);
        console.log(`[ਲਿਸਨਰ ${index + 1}] USA ਪ੍ਰੌਕਸੀ ਨਾਲ ਕਨੈਕਟ ਹੋ ਗਿਆ।`);

        response.data.on('data', (chunk) => {});
        response.data.on('end', () => {});

    } catch (error) {
        console.log(`[ਲਿਸਨਰ ${index + 1}] ਕਨੈਕਟ ਨਹੀਂ ਹੋ ਸਕਿਆ।`);
    }
}

for (let i = 0; i < listenersCount; i++) {
    const proxy = usaProxies[i % usaProxies.length];
    startListener(proxy, i);
}

setTimeout(() => {
    console.log("2 ਘੰਟੇ ਪੂਰੇ ਹੋ ਗਏ ਹਨ। ਸਾਰੇ ਲਿਸਨਰ ਬੰਦ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...");
    activeConnections.forEach(stream => stream.destroy());
    process.exit(0);
}, durationInMinutes * 60 * 1000);
