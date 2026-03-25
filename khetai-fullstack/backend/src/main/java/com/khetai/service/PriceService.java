package com.khetai.service;

import com.khetai.dto.GeminiRequest;
import com.khetai.dto.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.util.List;

@Service
public class PriceService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public PriceService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getPriceInsights(String crop, String location, String language) {
        try {
            String promptText = "Provide current local market (mandi) price trends, insights, and predictive analysis for " 
                + crop + " in " + location + ". Make it actionable for a farmer.";
            
            if (language != null && !language.trim().isEmpty()) {
                promptText += " IMPORTANT: Provide the final response strictly in the " + language + " language.";
            }

            GeminiRequest request = new GeminiRequest(List.of(
                new GeminiRequest.Content(List.of(
                    new GeminiRequest.Part(promptText)
                ))
            ));

            GeminiResponse response = webClient.post()
                    .uri(URI.create(apiUrl + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .block();

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                GeminiResponse.Candidate candidate = response.getCandidates().get(0);
                if (candidate.getContent() != null && candidate.getContent().getParts() != null && !candidate.getContent().getParts().isEmpty()) {
                    return candidate.getContent().getParts().get(0).getText();
                }
            }
            return "Could not retrieve price insights at this moment.";
        } catch (Exception e) {
            throw new RuntimeException("Error fetching price insights from AI: " + e.getMessage(), e);
        }
    }
}
