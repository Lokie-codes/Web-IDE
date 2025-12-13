package com.codeforge.server.controller;

import com.codeforge.server.dto.AICompleteRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

        @PostMapping("/complete")
        public ResponseEntity<Object> complete(@RequestBody AICompleteRequest request) {
                // Placeholder - replicate functionality
                String suggestion = "// AI-generated suggestion for " + request.getLanguage() + "\n" +
                                "// This is a placeholder response\n" +
                                request.getCode() + "\n\n" +
                                "// Add your implementation here";

                return ResponseEntity.ok(Map.<String, Object>of(
                                "success", true,
                                "suggestion", suggestion,
                                "confidence", 0.85));
        }

        @PostMapping("/explain")
        public ResponseEntity<Object> explain(@RequestBody Map<String, String> request) {
                String language = request.get("language");

                String explanation = "This " + language + " code performs the following operations:\n\n" +
                                "1. Defines variables and functions\n" +
                                "2. Implements core logic\n" +
                                "3. Returns results\n\n" +
                                "Would you like a more detailed explanation?";

                return ResponseEntity.ok(Map.<String, Object>of(
                                "success", true,
                                "explanation", explanation,
                                "complexity", "O(n)",
                                "suggestions", List.of(
                                                "Consider adding error handling",
                                                "Add input validation",
                                                "Optimize loops")));
        }
}
