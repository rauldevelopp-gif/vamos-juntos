const https = require('https');

const TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = 'team_YEQVwSWyTNfalmtA7lrShuvp';
const DOMAIN = 'your-travel-confort.vercel.app';

function api(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.vercel.com',
            port: 443,
            path: `${path}${path.includes('?') ? '&' : '?'}teamId=${TEAM_ID}`,
            method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(data ? JSON.parse(data) : {}));
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function migrate() {
    console.log('Fetching projects...');
    const data = await api('/v9/projects');
    const oldProj = data.projects.find(p => p.name === 'vamos-juntos');
    const newProj = data.projects.find(p => p.name === 'confort-travel-public');

    if (!oldProj || !newProj) {
        console.error('Projects not found:', { oldProj: !!oldProj, newProj: !!newProj });
        return;
    }

    console.log(`Removing ${DOMAIN} from ${oldProj.name}...`);
    await api(`/v9/projects/${oldProj.id}/domains/${DOMAIN}`, 'DELETE');

    console.log(`Adding ${DOMAIN} to ${newProj.name}...`);
    const result = await api(`/v10/projects/${newProj.id}/domains`, 'POST', { name: DOMAIN });

    console.log('Migration Result:', result);
}

migrate();
