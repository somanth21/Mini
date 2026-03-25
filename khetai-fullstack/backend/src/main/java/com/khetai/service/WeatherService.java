package com.khetai.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    public Map<String, Object> fetchWeather(String location) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://wttr.in/" + location + "?format=j1";
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null || !response.containsKey("current_condition")) {
                throw new RuntimeException("Invalid response from weather API");
            }
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> currentConditions = (List<Map<String, Object>>) response.get("current_condition");
            if (currentConditions.isEmpty()) {
                throw new RuntimeException("No weather data found");
            }
            
            Map<String, Object> conditionMap = currentConditions.get(0);
            
            String temp = (String) conditionMap.get("temp_C") + "°C";
            String humidity = (String) conditionMap.get("humidity") + "%";
            
            @SuppressWarnings("unchecked")
            List<Map<String, String>> descList = (List<Map<String, String>>) conditionMap.get("weatherDesc");
            String condition = descList != null && !descList.isEmpty() ? descList.get(0).get("value") : "Unknown";
            
            Map<String, Object> data = new HashMap<>();
            data.put("location", location);
            data.put("temperature", temp);
            data.put("humidity", humidity);
            data.put("condition", condition);
            
            return data;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch weather: " + e.getMessage());
        }
    }
}
