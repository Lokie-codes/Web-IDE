package com.codeforge.server.controller;

import com.codeforge.server.dto.ExecuteRequest;
import com.codeforge.server.service.PistonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/execute")
@RequiredArgsConstructor
public class ExecuteController {

    private final PistonService pistonService;

    @PostMapping
    public ResponseEntity<Object> execute(@RequestBody ExecuteRequest request) {
        if (request.getLanguage() == null || request.getCode() == null) {
            return ResponseEntity.badRequest().body(Map.<String, Object>of(
                    "success", false,
                    "error", "Language and code are required"));
        }

        String version = pistonService.getLanguageVersion(request.getLanguage());
        Object result = pistonService.executeCode(
                request.getLanguage(),
                version,
                request.getCode(),
                request.getStdin(),
                request.getArgs());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/runtimes")
    public ResponseEntity<Object> getRuntimes() {
        Object runtimes = pistonService.getRuntimes();
        return ResponseEntity.ok(Map.<String, Object>of(
                "success", true,
                "runtimes", runtimes));
    }
}
