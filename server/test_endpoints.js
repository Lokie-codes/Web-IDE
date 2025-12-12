
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

async function runTests() {
    console.log('Starting Tests...');

    // 1. Health Check
    try {
        console.log('1. Health Check...');
        const healthRes = await axios.get(`${BASE_URL}/health`);
        console.log('Health Status:', healthRes.status);
        console.log('Health Data:', JSON.stringify(healthRes.data));
    } catch (e) {
        console.error('Health Check Failed:', e.message);
        if (e.response) console.error('Data:', e.response.data);
        return;
    }

    // 2. Execute Runtimes
    try {
        console.log('2. Execute Runtimes...');
        const runtimesRes = await axios.get(`${BASE_URL}/execute/runtimes`);
        console.log('Runtimes Status:', runtimesRes.status);
        console.log('Runtimes Count:', runtimesRes.data.runtimes?.length || 0);
    } catch (e) {
        console.error('Runtimes Check Failed:', e.message);
        if (e.response) console.error('Data:', e.response.data);
    }

    // 3. Execute Code (JS)
    try {
        console.log('3. Execute Code...');
        const execRes = await axios.post(`${BASE_URL}/execute`, {
            language: 'javascript',
            version: '18.15.0',
            code: 'console.log("Hello from Piston!")'
        });
        console.log('Exec Status:', execRes.status);
        console.log('Exec Output:', execRes.data.run?.stdout?.trim());
        if (execRes.data.run?.stdout?.trim() === "Hello from Piston!") {
            console.log('✅ Exec Output Matches');
        } else {
            console.log('⚠️ Exec Output Mismatch or Empty');
        }
    } catch (e) {
        console.error('Exec Failed:', e.message);
        if (e.response) console.error('Data:', e.response.data);
    }

    // 4. AI Completion
    try {
        console.log('4. AI Completion...');
        const aiRes = await axios.post(`${BASE_URL}/ai/complete`, {
            language: 'javascript',
            code: 'fn()',
            prompt: 'complete'
        });
        console.log('AI Status:', aiRes.status);
    } catch (e) {
        console.error('AI Failed:', e.message);
    }

    // 5. Gists
    let gistId;
    try {
        console.log('5. Gists...');
        const create = await axios.post(`${BASE_URL}/gists`, {
            title: 'Test', language: 'javascript', code: 'log("hi")'
        });
        gistId = create.data.gist?.id;
        console.log('Gist Created:', gistId);

        if (gistId) {
            await axios.get(`${BASE_URL}/gists/${gistId}`);
            console.log('Gist Retrieved');
            await axios.put(`${BASE_URL}/gists/${gistId}`, {
                title: 'Upd', language: 'javascript', code: 'log("upd")'
            });
            console.log('Gist Updated');
        }
    } catch (e) {
        console.error('Gists Failed:', e.message);
    }

    // 6. Projects
    try {
        console.log('6. Projects...');
        const createP = await axios.post(`${BASE_URL}/projects`, {
            name: 'Test Proj', description: 'Desc'
        });
        const pid = createP.data.project?.id;
        console.log('Project Created:', pid);

        if (pid) {
            const addF = await axios.post(`${BASE_URL}/projects/${pid}/files`, {
                path: 'src/t.js', content: 'c', isFolder: false
            });
            console.log('File Added:', addF.data.file?.id);
        }
    } catch (e) {
        console.error('Projects Failed:', e.message);
        if (e.response) console.error('Data:', e.response.data);
    }

    console.log('Done.');
}

runTests();
