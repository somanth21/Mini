package com.khetai.service;

import com.khetai.dto.GeminiRequest;
import com.khetai.dto.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.util.List;

@Service
public class ChatService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public ChatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String sendMessage(String message) {
        GeminiRequest request = new GeminiRequest(List.of(
            new GeminiRequest.Content(List.of(
                new GeminiRequest.Part(message)
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
        return "No response from AI.";
    }
}
