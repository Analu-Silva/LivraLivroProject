package br.edu.atitus.book_service.controllers;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ws/cloudinary")
public class CloudinaryController {

    @Value("${cloudinary.cloud_name:}")
    private String cloudName;

    @Value("${cloudinary.api_key:}")
    private String apiKey;

    @Value("${cloudinary.api_secret:}")
    private String apiSecret;

    @Value("${cloudinary.upload_preset:}")
    private String uploadPreset;

    @GetMapping("/signature")
    public ResponseEntity<Map<String, String>> getSignature() {
        // fallback to environment variables if Spring properties are not populated
        if (cloudName == null || cloudName.isBlank()) {
            cloudName = System.getenv("CLOUDINARY_CLOUD_NAME");
        }
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = System.getenv("CLOUDINARY_API_KEY");
        }
        if (apiSecret == null || apiSecret.isBlank()) {
            apiSecret = System.getenv("CLOUDINARY_API_SECRET");
        }

        if (cloudName == null || cloudName.isBlank() || apiKey == null || apiKey.isBlank()
                || apiSecret == null || apiSecret.isBlank()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Cloudinary not configured on server");
            return ResponseEntity.status(500).body(err);
        }

        String timestamp = String.valueOf(System.currentTimeMillis() / 1000L);
        String toSign = "timestamp=" + timestamp;
        String signature;
        try {
            signature = sha1Hex(toSign + apiSecret);
        } catch (NoSuchAlgorithmException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to compute signature");
            return ResponseEntity.status(500).body(err);
        }

        Map<String, String> resp = new HashMap<>();
        resp.put("cloudName", cloudName);
        resp.put("apiKey", apiKey);
        resp.put("timestamp", timestamp);
        resp.put("signature", signature);
        if (uploadPreset != null && !uploadPreset.isBlank()) {
            resp.put("uploadPreset", uploadPreset);
        }

        return ResponseEntity.ok(resp);
    }

    private String sha1Hex(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] bytes = md.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

}
