
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

async function testExecution() {
    try {
        console.log('Fetching runtimes...');
        const runtimesRes = await axios.get(`${BASE_URL}/execute/runtimes`);
        console.log('Runtimes:', runtimesRes.status, runtimesRes.data.runtimes?.length);

        console.log('Executing code...');
        const execRes = await axios.post(`${BASE_URL}/execute`, {
            language: 'javascript',
            version: '18.15.0',
            code: 'console.log("Hello Piston")'
        });

        console.log('Status:', execRes.status);
        console.log('Full Response:', JSON.stringify(execRes.data, null, 2));
        const output = execRes.data.run?.stdout;
        console.log('Output:', JSON.stringify(output));

        if (execRes.data.run?.stderr) {
            console.log('Stderr:', execRes.data.run.stderr);
        }

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.error('Data:', JSON.stringify(e.response.data));
    }
}

testExecution();
