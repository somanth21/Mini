package com.khetai.service;

import com.khetai.dto.GeminiRequest;
import com.khetai.dto.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.util.Base64;
import java.util.List;
import java.util.ArrayList;

@Service
public class CropService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public CropService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String diagnoseCrop(MultipartFile file, String query, String language) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            String mimeType = file.getContentType();

            String promptText = "Analyze this crop image and identify any diseases or issues. Provide a detailed diagnosis and recommendations.";
            if (query != null && !query.trim().isEmpty()) {
                promptText += " Also address this specific concern: " + query + ".";
            }
            if (language != null && !language.trim().isEmpty()) {
                promptText += " IMPORTANT: Provide the final response strictly in the " + language + " language.";
            }

            GeminiRequest.Part textPart = new GeminiRequest.Part(promptText);
            GeminiRequest.Part imagePart = new GeminiRequest.Part(new GeminiRequest.InlineData(mimeType, base64Image));
            
            List<GeminiRequest.Part> parts = new ArrayList<>();
            parts.add(textPart);
            parts.add(imagePart);

            GeminiRequest request = new GeminiRequest(List.of(
                new GeminiRequest.Content(parts)
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
            return "Could not generate a diagnosis from the image.";
        } catch (Exception e) {
            throw new RuntimeException("Error processing crop diagnosis image: " + e.getMessage(), e);
        }
    }
}
