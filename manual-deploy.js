/**
 * Patch deploy – uploads only changed source files (excludes large binaries)
 * then points your-travel-confort.vercel.app to the new deployment.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = 'team_YEQVwSWyTNfalmtA7lrShuvp';
const PROJECT_NAME = 'confort-travel-public';


// Patterns to skip entirely
const SKIP = [/node_modules/, /\.next/, /\.git/, /\.gemini/, /\.db$/, /\.sqlite/, /prisma\/dev/, /\.(png|jpg|gif|ico|woff|ttf)$/i];

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        const rel = path.relative(process.cwd(), full).replace(/\\/g, '/');
        if (SKIP.some(p => p.test(rel))) continue;
        if (entry.isDirectory()) walk(full, files);
        else files.push({ full, rel });
    }
    return files;
}

function req(opts, body) {
    return new Promise((res, rej) => {
        const r = https.request(opts, rs => { let d = ''; rs.on('data', c => d += c); rs.on('end', () => { try { res(JSON.parse(d)); } catch { res(d); } }); });
        r.on('error', rej);
        if (body) r.write(typeof body === 'string' ? body : JSON.stringify(body));
        r.end();
    });
}

async function upload(sha, buf) {
    return new Promise((res, rej) => {
        const r = https.request({
            hostname: 'api.vercel.com', port: 443,
            path: `/v2/now/files?teamId=${TEAM_ID}`, method: 'POST',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/octet-stream', 'x-now-digest': sha, 'x-now-size': buf.length }
        }, rs => { rs.resume(); rs.on('end', res); });
        r.on('error', rej); r.write(buf); r.end();
    });
}

async function main() {
    console.log('Scanning source files (skipping binaries)…');
    const entries = walk(process.cwd());
    const files = entries.map(({ full, rel }) => {
        const c = fs.readFileSync(full);
        return { rel, sha: crypto.createHash('sha1').update(c).digest('hex'), size: c.length, buf: c };
    });
    console.log(`Found ${files.length} source files.`);

    const payload = { name: PROJECT, files: files.map(f => ({ file: f.rel, sha: f.sha, size: f.size })), projectSettings: { framework: 'nextjs' } };
    let result = await req({ hostname: 'api.vercel.com', port: 443, path: `/v13/deployments?teamId=${TEAM_ID}`, method: 'POST', headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } }, payload);

    if (result.error?.code === 'missing_files') {
        console.log(`Uploading ${result.error.missing.length} missing files…`);
        for (const sha of result.error.missing) {
            const f = files.find(f => f.sha === sha);
            if (f) { await upload(sha, f.buf); console.log('  ↑', f.rel); }
        }
        console.log('Retrying…');
        result = await req({ hostname: 'api.vercel.com', port: 443, path: `/v13/deployments?teamId=${TEAM_ID}`, method: 'POST', headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } }, payload);
    }

    if (result.error) { console.error('Error:', result.error); return; }

    console.log('Deployed!', result.id, '-', result.url);
    console.log('Pointing alias…');
    await new Promise(r => setTimeout(r, 8000));
    const alias = await req({ hostname: 'api.vercel.com', port: 443, path: `/v2/deployments/${result.id}/aliases?teamId=${TEAM_ID}`, method: 'POST', headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } }, { alias: 'your-travel-confort.vercel.app' });
    console.log('Alias:', alias.alias || alias.error?.message);
}

main();
