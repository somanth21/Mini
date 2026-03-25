package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.dto.ChatRequest;
import com.khetai.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody ChatRequest request) {
        String message = request.getMessage();
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message is required");
        }

        String reply = chatService.sendMessage(message);
        return ResponseEntity.ok(ApiResponse.success("Message processed successfully", reply));
    }
}
