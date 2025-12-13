package com.codeforge.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PistonService {

    @Value("${piston.url:http://localhost:2000}")
    private String pistonUrl;

    private final RestClient restClient;

    public PistonService(RestClient.Builder builder, @Value("${piston.url:http://localhost:2000}") String pistonBaseUrl) {
        this.restClient = builder.baseUrl(pistonBaseUrl + "/api/v2").build();
    }

    public Object getRuntimes() {
        return restClient.get()
                .uri("/runtimes")
                .retrieve()
                .body(Object.class);
    }

    public Object executeCode(String language, String version, String code, String stdin, List<String> args) {
        String pistonLanguage = getPistonLanguage(language);
        String fileName = getFileName(language);

        Map<String, Object> payload = new HashMap<>();
        payload.put("language", pistonLanguage);
        payload.put("version", version);
        payload.put("files", Collections.singletonList(Map.of("name", fileName, "content", code)));
        payload.put("stdin", stdin != null ? stdin : "");
        payload.put("args", args != null ? args : Collections.emptyList());
        payload.put("compile_timeout", 3000);
        payload.put("run_timeout", 3000);
        payload.put("compile_memory_limit", -1);
        payload.put("run_memory_limit", -1);

        try {
            Map result = restClient.post()
                    .uri("/execute")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(Map.class);
            return formatResponse(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of(
                    "success", false,
                    "error", e.getMessage(),
                    "stdout", "",
                    "stderr", e.getMessage(),
                    "exitCode", 1
            );
        }
    }

    private Map<String, Object> formatResponse(Map<String, Object> data) {
        Map<String, Object> run = (Map<String, Object>) data.get("run");
        Map<String, Object> compile = (Map<String, Object>) data.get("compile");

        StringBuilder output = new StringBuilder();
        StringBuilder error = new StringBuilder();
        boolean success = true;

        if (compile != null) {
            String stderr = (String) compile.get("stderr");
            String stdout = (String) compile.get("stdout");
            if (stderr != null && !stderr.isEmpty()) {
                error.append("[Compilation Error]\n").append(stderr).append("\n");
                success = false;
            }
            if (stdout != null && !stdout.isEmpty()) {
                output.append("[Compilation Output]\n").append(stdout).append("\n");
            }
        }

        if (run != null) {
            String stdout = (String) run.get("stdout");
            String stderr = (String) run.get("stderr");
            Integer code = (Integer) run.get("code");

            if (stdout != null) {
                output.append(stdout);
            }
            if (stderr != null && !stderr.isEmpty()) {
                error.append(stderr);
                if (code != null && code != 0) {
                    success = false;
                }
            }
            
            return Map.of(
                    "success", success && (code == null || code == 0) && error.length() == 0,
                    "stdout", output.toString().trim(),
                    "stderr", error.toString().trim(),
                    "exitCode", code != null ? code : 0,
                    "signal", run.get("signal") != null ? run.get("signal") : ""
            );
        }

        return Map.of(
                "success", success,
                "stdout", output.toString().trim(),
                "stderr", error.toString().trim(),
                "exitCode", compile != null && compile.get("code") != null ? compile.get("code") : 0
        );
    }

    public String getLanguageVersion(String language) {
        return switch (language) {
            case "javascript" -> "18.15.0";
            case "typescript" -> "5.0.3";
            case "python" -> "3.10.0";
            case "java" -> "15.0.2";
            case "cpp", "c" -> "10.2.0";
            case "csharp" -> "6.12.0";
            case "go" -> "1.16.2";
            case "rust" -> "1.68.2";
            case "ruby" -> "3.0.1";
            case "php" -> "8.2.3";
            case "swift" -> "5.3.3";
            case "kotlin" -> "1.8.20";
            case "bash" -> "5.2.0";
            default -> "*";
        };
    }

    private String getFileName(String language) {
        return switch (language) {
            case "javascript" -> "main.js";
            case "typescript" -> "main.ts";
            case "python" -> "main.py";
            case "java" -> "Main.java";
            case "cpp" -> "main.cpp";
            case "c" -> "main.c";
            case "csharp" -> "Main.cs";
            case "go" -> "main.go";
            case "rust" -> "main.rs";
            case "ruby" -> "main.rb";
            case "php" -> "main.php";
            case "swift" -> "main.swift";
            case "kotlin" -> "Main.kt";
            case "bash" -> "main.sh";
            default -> "main.txt";
        };
    }

    private String getPistonLanguage(String language) {
        return switch (language) {
            case "javascript" -> "javascript";
            case "typescript" -> "typescript";
            case "python" -> "python";
            case "java" -> "java";
            case "cpp", "c" -> "gcc";
            case "csharp" -> "dotnet";
            case "go" -> "go";
            case "rust" -> "rust";
            case "php" -> "php";
            case "bash" -> "bash";
            case "ruby" -> "ruby";
            default -> language;
        };
    }
}
