package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.entity.QueryHistory;
import com.khetai.entity.User;
import com.khetai.repository.QueryHistoryRepository;
import com.khetai.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final QueryHistoryRepository queryHistoryRepository;
    private final UserRepository userRepository;

    public AdminController(QueryHistoryRepository queryHistoryRepository, UserRepository userRepository) {
        this.queryHistoryRepository = queryHistoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/all-queries")
    public ResponseEntity<ApiResponse<List<QueryHistory>>> getAllQueries() {
        List<QueryHistory> history = queryHistoryRepository.findAllByOrderByTimestampDesc();
        return ResponseEntity.ok(ApiResponse.success("All queries fetched", history));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("All users fetched", users));
    }
}
