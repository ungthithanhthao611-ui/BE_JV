package com.example.demo.service;

import com.example.demo.config.MomoConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientResponseException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class MomoService {

    private final MomoConfig momoConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MomoService(MomoConfig momoConfig, RestTemplate restTemplate) {
        this.momoConfig = momoConfig;
        this.restTemplate = restTemplate;
    }

    public String createPayment(String orderId, String amount, String orderInfo) throws Exception {
        // USE ENDPOINT FROM REFERENCE: /v2/gateway/api/create
        String endpoint = momoConfig.getEndpoint() + "/v2/gateway/api/create";

        String partnerCode = momoConfig.getPartnerCode();
        String accessKey = momoConfig.getAccessKey();
        String secretKey = momoConfig.getSecretKey();
        String redirectUrl = momoConfig.getRedirectUrl();
        String ipnUrl = momoConfig.getIpnUrl();

        String requestId = UUID.randomUUID().toString();
        // Change to "payWithMethod" to show method selection screen (ATM, Visa,
        // Wallet...)
        String requestType = "payWithMethod";
        String extraData = "";

        // TẠO MOMO ORDER ID ĐỘC NHẤT (tránh lỗi duplicate ID từ MoMo khi retry)
        // Format: ORDER_DBID_TIMESTAMP (VD: ORDER_15_1763283283)
        // Lưu ý: Hệ thống IPN phải biết cách parse ID này nếu cần tìm order gốc
        // Nhưng hiện tại để an toàn ta cứ dùng nguyên orderId được truyền vào nếu nó đã
        // unique
        // Nếu user truyền vào "ORDER_15_...", ta giữ nguyên.
        String momoOrderId = orderId;

        // Validate Amount (Long)
        long amountLong = Double.valueOf(amount).longValue();
        String amountStr = String.valueOf(amountLong);

        System.out.println(">>> ===== MOMO PAYMENT REQUEST (V2 API CREATE) =====");
        System.out.println(">>> Endpoint: " + endpoint);
        System.out.println(">>> OrderId: " + momoOrderId);
        System.out.println(">>> Amount: " + amountStr);
        System.out.println(">>> RequestType: " + requestType);

        // RAW SIGNATURE (Alphabetical Order - COPY TỪ REFERENCE)
        // accessKey + amount + extraData + ipnUrl + orderId + orderInfo + partnerCode +
        // redirectUrl + requestId + requestType
        String rawSignature = "accessKey=" + accessKey +
                "&amount=" + amountStr +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + momoOrderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        System.out.println(">>> Raw Signature: " + rawSignature);

        String signature = hmacSHA256(secretKey, rawSignature);
        System.out.println(">>> Generated Signature: " + signature);

        // Build request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("partnerCode", partnerCode);
        requestBody.put("partnerName", "TeaShop");
        requestBody.put("storeId", "TeaShop");
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amountLong); // Send as Long
        requestBody.put("orderId", momoOrderId);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", redirectUrl);
        requestBody.put("ipnUrl", ipnUrl);
        requestBody.put("lang", "vi");
        requestBody.put("extraData", extraData);
        requestBody.put("requestType", requestType);
        requestBody.put("signature", signature);

        String jsonBody = objectMapper.writeValueAsString(requestBody);
        System.out.println(">>> JSON Body: " + jsonBody);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(endpoint, entity, String.class);
            String responseBody = responseEntity.getBody();

            System.out.println(">>> MoMo Response: " + responseBody);

            Map<String, Object> response = objectMapper.readValue(responseBody, Map.class);

            if (response.containsKey("payUrl")) {
                String payUrl = response.get("payUrl").toString();
                System.out.println(">>> ✅ SUCCESS! PayUrl: " + payUrl);
                return payUrl;
            } else {
                String message = response.getOrDefault("message", "Unknown error").toString();
                throw new RuntimeException("MoMo Error: " + message);
            }

        } catch (RestClientResponseException e) {
            System.err.println(">>> ❌ MoMo HTTP Error: " + e.getRawStatusCode());
            System.err.println(">>> Body: " + e.getResponseBodyAsString());
            throw new RuntimeException("MoMo HTTP Error: " + e.getResponseBodyAsString());
        }
    }

    private String hmacSHA256(String key, String data) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKeySpec);
        byte[] bytes = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}
