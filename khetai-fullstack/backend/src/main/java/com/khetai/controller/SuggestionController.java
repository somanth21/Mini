package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.service.SuggestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private final SuggestionService suggestionService;

    public SuggestionController(SuggestionService suggestionService) {
        this.suggestionService = suggestionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSuggestions(@RequestBody Map<String, String> request) {
        String crop = request.get("crop");
        String weather = request.get("weather");

        List<String> suggestionsList = suggestionService.getSuggestions(crop, weather);
        
        Map<String, Object> data = new HashMap<>();
        data.put("suggestions", suggestionsList);

        return ResponseEntity.ok(ApiResponse.success("Suggestions generated successfully", data));
    }
}
