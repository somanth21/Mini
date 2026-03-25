package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.entity.User;
import com.khetai.repository.UserRepository;
import com.khetai.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isEmpty() || password == null || password.length() < 4) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Valid email and password (min 4 chars) are required"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email address already registered"));
        }

        String role = email.equals("admin") || email.equals("admin@khetai.com") ? "ADMIN" : "USER";
        User user = new User(email, passwordEncoder.encode(password), role);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Registration successful. Please login.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid email or password"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid email or password"));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Login successful", token));
    }
}
