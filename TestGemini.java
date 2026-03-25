import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class TestGemini {
    public static void main(String[] args) throws Exception {
        String key = "AIzaSyAY7Z5ahBwFtacijP4XgC4w68FI8KreIQ0";
        String[] models = {"gemini-1.5-flash", "gemini-2.0-flash", "gemini-3-flash-preview"};
        
        HttpClient client = HttpClient.newHttpClient();
        String jsonBody = "{\"contents\":[{\"parts\":[{\"text\":\"Hello\"}]}]}";
        
        for (String model : models) {
            System.out.println("Testing model: " + model);
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + key;
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
                
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Status: " + response.statusCode());
            System.out.println("Body: " + response.body());
            System.out.println("---------------------------------------------------");
        }
    }
}
