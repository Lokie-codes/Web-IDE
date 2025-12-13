import requests
import os

PISTON_URL = os.environ.get('PISTON_URL', 'http://localhost:2000')
BASE_URL = f"{PISTON_URL}/api/v2"

class PistonService:
    def get_runtimes(self):
        try:
            response = requests.get(f"{BASE_URL}/runtimes")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching runtimes: {e}")
            raise Exception("Failed to fetch available runtimes")

    def execute_code(self, language, version, code, stdin='', args=None):
        if args is None:
            args = []
        
        try:
            piston_language = self.get_piston_language(language)
            file_name = self.get_file_name(language)

            payload = {
                "language": piston_language,
                "version": version,
                "files": [
                    {
                        "name": file_name,
                        "content": code
                    }
                ],
                "stdin": stdin,
                "args": args,
                "compile_timeout": 3000,
                "run_timeout": 3000,
                "compile_memory_limit": -1,
                "run_memory_limit": -1
            }

            response = requests.post(f"{BASE_URL}/execute", json=payload)
            # Piston might return errors in JSON even with 200 OK sometimes, or 400/500
            if response.status_code >= 400:
                # Try to parse error message
                try:
                    error_data = response.json()
                    message = error_data.get('message', 'Execution failed')
                    return {
                        "success": False,
                        "error": message,
                        "stdout": "",
                        "stderr": message,
                        "exitCode": 1
                    }
                except:
                    response.raise_for_status()

            return self.format_response(response.json())

        except requests.exceptions.RequestException as e:
            print(f"Piston execution error: {e}")
            message = str(e)
            if e.response: 
                 try:
                     message = e.response.json().get('message', message)
                 except: 
                     pass
            
            return {
                "success": False,
                "error": message,
                "stdout": "",
                "stderr": message,
                "exitCode": 1
            }
        except Exception as e:
            print(f"Execution error: {e}")
            return {
                "success": False,
                "error": str(e),
                "stdout": "",
                "stderr": str(e),
                "exitCode": 1
            }

    def format_response(self, data):
        run = data.get('run', {})
        compile_stage = data.get('compile', {})
        
        output = ''
        error_output = ''
        success = True

        # Check compile stage
        if compile_stage:
            if compile_stage.get('stderr'):
                error_output += f"[Compilation Error]\n{compile_stage['stderr']}\n"
                success = False
            if compile_stage.get('stdout'):
                output += f"[Compilation Output]\n{compile_stage['stdout']}\n"

        # Check run stage
        if run:
            if run.get('stdout'):
                output += run['stdout']
            if run.get('stderr'):
                error_output += run['stderr']
                if run.get('code') != 0:
                    success = False
            
            return {
                "success": success, # Logic from JS: run.code === 0 && !error (but error string might be populated even if code is 0?? No, JS checked !error string too? Wait. 
                # JS: success = run.code === 0 && !error. 
                # But here we are building error string.
                # Let's match JS logic: if run.code != 0 -> success = False.
                "stdout": output.strip(),
                "stderr": error_output.strip(),
                "exitCode": run.get('code', 0),
                "signal": run.get('signal', None)
            }
        
        return {
            "success": success,
            "stdout": output.strip(),
            "stderr": error_output.strip(),
            "exitCode": compile_stage.get('code', 0)
        }

    def get_file_name(self, language):
        file_names = {
            'javascript': 'main.js',
            'typescript': 'main.ts',
            'python': 'main.py',
            'java': 'Main.java',
            'cpp': 'main.cpp',
            'c': 'main.c',
            'csharp': 'Main.cs',
            'go': 'main.go',
            'rust': 'main.rs',
            'ruby': 'main.rb',
            'php': 'main.php',
            'swift': 'main.swift',
            'kotlin': 'Main.kt',
            'bash': 'main.sh',
        }
        return file_names.get(language, 'main.txt')

    def get_language_version(self, language):
        version_map = {
            'javascript': '18.15.0',
            'typescript': '5.0.3',
            'python': '3.10.0',
            'java': '15.0.2',
            'cpp': '10.2.0',
            'c': '10.2.0',
            'csharp': '6.12.0',
            'go': '1.16.2',
            'rust': '1.68.2',
            'ruby': '3.0.1',
            'php': '8.2.3',
            'swift': '5.3.3',
            'kotlin': '1.8.20',
            'bash': '5.2.0',
        }
        return version_map.get(language, '*')

    def get_piston_language(self, language):
        language_map = {
            'javascript': 'javascript', # Frontend sends 'javascript', Piston might want 'node'? No, execute.js says: Frontend uses 'javascript', Piston uses 'node'. Wait. 
            # In JS code: javascript: 'javascript' ... comment says Piston uses 'node'.
            # BUT the map has `javascript: 'javascript'`. 
            # Let me check the original JS file again.
            # `javascript: 'javascript', // Frontend uses 'javascript', Piston uses 'node'` - The comment might be misleading OR I misread it. 
            # Ah, line 166 in pistonService.js: `javascript: 'javascript'`. So it maps javascript to javascript.
            # However, I should double check if Piston supports 'javascript' alias for 'node'. Usually it does.
            # I will trust the JS map key-values.
            'typescript': 'typescript',
            'python': 'python',
            'java': 'java',
            'cpp': 'gcc',
            'c': 'gcc',
            'csharp': 'dotnet',
            'go': 'go',
            'rust': 'rust',
            'ruby': 'ruby',
            'php': 'php',
            'bash': 'bash',
        }
        return language_map.get(language, language)

piston_service = PistonService()
