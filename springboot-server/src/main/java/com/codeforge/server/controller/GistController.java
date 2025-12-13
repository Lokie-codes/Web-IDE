package com.codeforge.server.controller;

import com.codeforge.server.dto.GistRequest;
import com.codeforge.server.model.Gist;
import com.codeforge.server.repository.GistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/gists")
@RequiredArgsConstructor
public class GistController {

        private final GistRepository gistRepository;

        @PostMapping
        public ResponseEntity<Object> createGist(@RequestBody GistRequest request) {
                if (request.getLanguage() == null || request.getCode() == null) {
                        return ResponseEntity.badRequest().body(Map.<String, Object>of(
                                        "success", false,
                                        "error", "Language and code are required"));
                }

                Gist gist = new Gist();
                String id = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
                gist.setId(id);
                gist.setTitle(request.getTitle() != null ? request.getTitle() : "Untitled");
                gist.setLanguage(request.getLanguage());
                gist.setCode(request.getCode());
                gist.setTheme(request.getTheme() != null ? request.getTheme() : "vs-dark");

                gistRepository.save(gist);

                return ResponseEntity.ok(Map.<String, Object>of(
                                "success", true,
                                "gist", Map.<String, Object>of(
                                                "id", gist.getId(),
                                                "title", gist.getTitle(),
                                                "language", gist.getLanguage(),
                                                "code", gist.getCode(),
                                                "theme", gist.getTheme(),
                                                "url", "/gist/" + gist.getId())));
        }

        @GetMapping("/{id}")
        public ResponseEntity<Object> getGist(@PathVariable String id) {
                return gistRepository.findById(id)
                                .map(gist -> {
                                        gist.setViewCount(gist.getViewCount() + 1);
                                        gistRepository.save(gist);
                                        return ResponseEntity.ok((Object) Map.<String, Object>of(
                                                        "success", true,
                                                        "gist", gist));
                                })
                                .orElse(ResponseEntity.status(404).body(Map.<String, Object>of(
                                                "success", false,
                                                "error", "Gist not found")));
        }

        @PutMapping("/{id}")
        public ResponseEntity<Object> updateGist(@PathVariable String id, @RequestBody GistRequest request) {
                return gistRepository.findById(id)
                                .map(gist -> {
                                        if (request.getTitle() != null)
                                                gist.setTitle(request.getTitle());
                                        if (request.getCode() != null)
                                                gist.setCode(request.getCode());
                                        if (request.getLanguage() != null)
                                                gist.setLanguage(request.getLanguage());
                                        if (request.getTheme() != null)
                                                gist.setTheme(request.getTheme());

                                        gistRepository.save(gist);

                                        return ResponseEntity.ok((Object) Map.<String, Object>of(
                                                        "success", true,
                                                        "message", "Gist updated successfully"));
                                })
                                .orElse(ResponseEntity.status(404).body(Map.<String, Object>of(
                                                "success", false,
                                                "error", "Gist not found")));
        }

        @GetMapping
        public ResponseEntity<Object> listGists(@RequestParam(defaultValue = "10") int limit) {
                List<Gist> gists = gistRepository.findLatest(PageRequest.of(0, limit));
                return ResponseEntity.ok(Map.<String, Object>of(
                                "success", true,
                                "gists", gists));
        }
}
