package com.khetai.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class SuggestionService {

    public List<String> getSuggestions(String crop, String weather) {
        List<String> suggestions = new ArrayList<>();
        
        String cropLower = crop != null ? crop.toLowerCase() : "";
        String weatherLower = weather != null ? weather.toLowerCase() : "";

        // Weather-based rules
        if (weatherLower.contains("rain") || weatherLower.contains("drizzle") || weatherLower.contains("shower")) {
            suggestions.add("Avoid watering today due to the rain forecast.");
            suggestions.add("Ensure your field has proper drainage to prevent waterlogging.");
            if (cropLower.contains("cotton")) {
                suggestions.add("Protect harvested cotton from getting wet.");
            }
        } else if (weatherLower.contains("sun") || weatherLower.contains("clear")) {
            suggestions.add("Good weather for outdoor field work today.");
            suggestions.add("Ensure adequate irrigation, especially during peak afternoon sun.");
            if (cropLower.contains("wheat")) {
                suggestions.add("Favorable conditions for wheat maturation or harvesting.");
            }
        } else if (weatherLower.contains("cloud") || weatherLower.contains("overcast")) {
            suggestions.add("Cloudy weather is ideal for applying fertilizers or pesticides without risk of rapid evaporation.");
        } else if (!weatherLower.isEmpty()) {
            suggestions.add("Keep monitoring local forecasts for sudden weather changes.");
        }

        // Crop-based rules
        if (cropLower.contains("rice") || cropLower.contains("paddy")) {
            suggestions.add("Maintain standing water levels in paddies appropriately.");
            suggestions.add("Check for early signs of blast disease or stem borer insects.");
        } else if (cropLower.contains("wheat")) {
            suggestions.add("Monitor for rust infections on leaves.");
        } else if (cropLower.contains("cotton")) {
            suggestions.add("Check for pink bollworm infestations.");
        } else if (cropLower.contains("maize") || cropLower.contains("corn")) {
            suggestions.add("Ensure appropriate nitrogen fertilizer application for rapid vegetative growth.");
        } else if (!cropLower.isEmpty()) {
            suggestions.add("Ensure the soil pH is strictly balanced for optimal " + crop + " growth.");
        }

        // Default if both are empty or we need general advice
        if (suggestions.isEmpty()) {
            suggestions.add("Best time to sow seeds or apply foliar sprays is early morning or late afternoon.");
            suggestions.add("Regularly weed your fields to reduce competition for nutrients and water.");
        }

        return suggestions;
    }
}
