import axios from 'axios';

const PISTON_URL = process.env.PISTON_URL || 'http://localhost:2000';

class PistonService {
    constructor() {
        this.baseURL = `${PISTON_URL}/api/v2`;
    }

    /**
     * Get all available runtimes
     */
    async getRuntimes() {
        try {
            const response = await axios.get(`${this.baseURL}/runtimes`);
            return response.data;
        } catch (error) {
            console.error('Error fetching runtimes:', error.message);
            throw new Error('Failed to fetch available runtimes');
        }
    }

    /**
     * Execute code with Piston
     */
    async executeCode({ language, version, code, stdin = '', args = [] }) {
        try {
                const pistonLanguage = this.getPistonLanguage(language);

            const payload = {
                language: pistonLanguage,
                version,
                files: [
                    {
                        name: this.getFileName(language),
                        content: code
                    }
                ],
                stdin,
                args,
                compile_timeout: 3000,
                run_timeout: 3000,
                compile_memory_limit: -1,
                run_memory_limit: -1
            };

            const response = await axios.post(`${this.baseURL}/execute`, payload);
            return this.formatResponse(response.data);
        } catch (error) {
            console.error('Piston execution error:', error.message);

            if (error.response) {
                return {
                    success: false,
                    error: error.response.data.message || 'Execution failed',
                    stdout: '',
                    stderr: error.response.data.message || 'Unknown error',
                    exitCode: 1
                };
            }

            throw new Error('Failed to execute code');
        }
    }

    /**
     * Format Piston response
     */
    formatResponse(data) {
        const { run, compile } = data;

        let output = '';
        let error = '';
        let success = true;

        // Check compile stage first (for compiled languages)
        if (compile) {
            if (compile.stderr) {
                error += `[Compilation Error]\n${compile.stderr}\n`;
                success = false;
            }
            if (compile.stdout) {
                output += `[Compilation Output]\n${compile.stdout}\n`;
            }
        }

        // Check run stage
        if (run) {
            if (run.stdout) {
                output += run.stdout;
            }
            if (run.stderr) {
                error += run.stderr;
                if (run.code !== 0) {
                    success = false;
                }
            }

            return {
                success: run.code === 0 && !error,
                stdout: output.trim(),
                stderr: error.trim(),
                exitCode: run.code || 0,
                signal: run.signal || null
            };
        }

        return {
            success,
            stdout: output.trim(),
            stderr: error.trim(),
            exitCode: compile?.code || 0
        };
    }

    /**
     * Get appropriate filename based on language
     */
    getFileName(language) {
        const fileNames = {
            javascript: 'main.js',
            typescript: 'main.ts',
            python: 'main.py',
            java: 'Main.java',
            cpp: 'main.cpp',
            c: 'main.c',
            csharp: 'Main.cs',
            go: 'main.go',
            rust: 'main.rs',
            ruby: 'main.rb',
            php: 'main.php',
            swift: 'main.swift',
            kotlin: 'Main.kt',
            bash: 'main.sh',
        };

        return fileNames[language] || 'main.txt';
    }

    /**
     * Get language version mapping
     */
    getLanguageVersion(language) {
        const versionMap = {
            javascript: '18.15.0',
            typescript: '5.0.3',
            python: '3.10.0',
            java: '15.0.2',
            cpp: '10.2.0',
            c: '10.2.0',
            csharp: '6.12.0',
            go: '1.16.2',
            rust: '1.68.2',
            ruby: '3.0.1',
            php: '8.2.3',
            swift: '5.3.3',
            kotlin: '1.8.20',
            bash: '5.2.0',
        };

        return versionMap[language] || '*';
    }

    getPistonLanguage(language) {
        const languageMap = {
            javascript: 'javascript',      // Frontend uses 'javascript', Piston uses 'node'
            typescript: 'typescript',
            python: 'python',
            java: 'java',
            cpp: 'gcc',              // C++ uses gcc
            c: 'gcc',                // C uses gcc
            csharp: 'dotnet',
            go: 'go',
            rust: 'rust',
            ruby: 'ruby',
            php: 'php',
            bash: 'bash',
        };
        return languageMap[language] || language;
    }
}

export default new PistonService();
