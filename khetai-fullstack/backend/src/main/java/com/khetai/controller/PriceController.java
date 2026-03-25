package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.service.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PriceController {

    private final PriceService priceService;

    @Autowired
    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    @GetMapping("/mandi-prices")
    public ResponseEntity<ApiResponse<String>> getMandiPrices(
            @RequestParam("crop") String crop,
            @RequestParam("location") String location,
            @RequestParam(value = "language", required = false) String language) {
        
        if (crop == null || crop.trim().isEmpty() || location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Crop and Location are required");
        }
        
        String summary = priceService.getPriceInsights(crop, location, language);
        return ResponseEntity.ok(ApiResponse.success("Mandi prices retrieved successfully", summary));
    }
}
