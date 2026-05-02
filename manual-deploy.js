const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = 'team_YEQVwSWyTNfalmtA7lrShuvp';
const PROJECT_NAME = 'confort-travel-public';

async function deploy() {
    console.log('--- Starting Deployment ---');

    const files = [];
    function walkSync(dir) {
        const filesInDir = fs.readdirSync(dir);
        for (const file of filesInDir) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

            if (relativePath.includes('node_modules') ||
                relativePath.includes('.next') ||
                relativePath.includes('.git') ||
                relativePath.includes('.gemini')) continue;

            if (stat.isDirectory()) {
                walkSync(filePath);
            } else {
                const content = fs.readFileSync(filePath);
                files.push({
                    file: relativePath,
                    sha: crypto.createHash('sha1').update(content).digest('hex'),
                    size: content.length,
                    content: content
                });
            }
        }
    }

    walkSync(process.cwd());
    console.log(`Found ${files.length} files to upload.`);

    const deploymentData = {
        name: PROJECT_NAME,
        files: files.map(f => ({ file: f.file, sha: f.sha, size: f.size })),
        projectSettings: { framework: 'nextjs' }
    };

    const options = {
        hostname: 'api.vercel.com',
        port: 443,
        path: `/v13/deployments?teamId=${TEAM_ID}`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', async () => {
            const result = JSON.parse(body);
            if (result.error) {
                if (result.error.code === 'missing_files') {
                    const missingSHAs = result.error.missing;
                    console.log(`Uploading ${missingSHAs.length} missing files...`);

                    for (const sha of missingSHAs) {
                        const fileData = files.find(f => f.sha === sha);
                        if (fileData) {
                            await uploadFile(sha, fileData.content, fileData.size);
                        }
                    }

                    console.log('All missing files uploaded. Retrying deployment...');
                    deploy(); // Retry
                    return;
                }
                console.error('Deployment Error:', result.error);
                return;
            }
            console.log('Upload Successful!');
            console.log('Deployment ID:', result.id);
            console.log('Status:', result.readyState);
            console.log('URL:', result.url);
        });
    });

    req.on('error', (e) => console.error(e));
    req.write(JSON.stringify(deploymentData));
    req.end();
}

function uploadFile(sha, content, size) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.vercel.com',
            port: 443,
            path: `/v2/now/files?teamId=${TEAM_ID}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/octet-stream',
                'x-now-digest': sha,
                'x-now-size': size
            }
        };

        const req = https.request(options, (res) => {
            res.on('data', () => { });
            res.on('end', () => {
                console.log(`Uploaded ${sha}`);
                resolve();
            });
        });
        req.on('error', reject);
        req.write(content);
        req.end();
    });
}

deploy();
