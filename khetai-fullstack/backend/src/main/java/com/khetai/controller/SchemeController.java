package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SchemeController {

    private final SchemeService schemeService;

    @Autowired
    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping("/schemes")
    public ResponseEntity<ApiResponse<String>> getSchemeSummary(
            @RequestParam("schemeName") String schemeName,
            @RequestParam("query") String query,
            @RequestParam(value = "language", required = false) String language) {
        
        if (schemeName == null || schemeName.trim().isEmpty() || query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Scheme Name and Query are required");
        }
        
        String summary = schemeService.summarizeScheme(schemeName, query, language);
        return ResponseEntity.ok(ApiResponse.success("Scheme summary generated successfully", summary));
    }
}
