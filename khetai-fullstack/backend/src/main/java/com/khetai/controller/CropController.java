package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.service.CropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class CropController {

    private final CropService cropService;

    @Autowired
    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping("/crop-diagnosis")
    public ResponseEntity<ApiResponse<String>> diagnoseCrop(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "language", required = false) String language) {
        
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }
        String diagnosis = cropService.diagnoseCrop(image, query, language);
        return ResponseEntity.ok(ApiResponse.success("Diagnosis complete", diagnosis));
    }
}
