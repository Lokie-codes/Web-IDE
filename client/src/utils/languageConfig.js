export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', monacoId: 'javascript' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', monacoId: 'typescript' },
  { id: 'python', name: 'Python', extension: '.py', monacoId: 'python' },
  { id: 'java', name: 'Java', extension: '.java', monacoId: 'java' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoId: 'cpp' },
  { id: 'c', name: 'C', extension: '.c', monacoId: 'c' },
  { id: 'csharp', name: 'C#', extension: '.cs', monacoId: 'csharp' },
  { id: 'go', name: 'Go', extension: '.go', monacoId: 'go' },
  { id: 'rust', name: 'Rust', extension: '.rs', monacoId: 'rust' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', monacoId: 'ruby' },
  { id: 'php', name: 'PHP', extension: '.php', monacoId: 'php' },
  { id: 'swift', name: 'Swift', extension: '.swift', monacoId: 'swift' },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', monacoId: 'kotlin' },
  { id: 'html', name: 'HTML', extension: '.html', monacoId: 'html' },
  { id: 'css', name: 'CSS', extension: '.css', monacoId: 'css' },
  { id: 'json', name: 'JSON', extension: '.json', monacoId: 'json' },
  { id: 'sql', name: 'SQL', extension: '.sql', monacoId: 'sql' },
  { id: 'shell', name: 'Shell', extension: '.sh', monacoId: 'shell' },
];

export const DEFAULT_CODE = {
  javascript: '// JavaScript\nconsole.log("Hello, World!");',
  typescript: '// TypeScript\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);',
  python: '# Python\nprint("Hello, World!")',
  java: '// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '// C++\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  c: '// C\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  go: '// Go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  rust: '// Rust\nfn main() {\n    println!("Hello, World!");\n}',
  ruby: '# Ruby\nputs "Hello, World!"',
  php: '<?php\n// PHP\necho "Hello, World!";',
};

export const getDefaultCode = (language) => {
  return DEFAULT_CODE[language] || `// ${language}\n// Start coding here...`;
};
