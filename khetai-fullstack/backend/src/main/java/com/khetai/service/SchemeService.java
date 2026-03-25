package com.khetai.service;

import com.khetai.dto.GeminiRequest;
import com.khetai.dto.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.util.List;

@Service
public class SchemeService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public SchemeService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String summarizeScheme(String schemeName, String query, String language) {
        try {
            String promptText = "You are an agricultural policy assistant. Summarize the following government scheme: " 
                + schemeName + ". Specifically address this farmer's query: " + query 
                + ". Keep the explanation simple and action-oriented.";
            
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
            return "Could not retrieve scheme information at this moment.";
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving scheme information: " + e.getMessage(), e);
        }
    }
}
