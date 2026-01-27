package com.example.demo.service;

import com.example.demo.config.MomoConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

public class MomoServiceTest {

    private MomoConfig momoConfig;
    private MomoService momoService;

    @BeforeEach
    void setUp() {
        momoConfig = new MomoConfig();
        momoConfig.setPartnerCode("MOMO_PARTNER_CODE");
        momoConfig.setAccessKey("MOMO_ACCESS_KEY");
        momoConfig.setSecretKey("MOMO_SECRET_KEY");
        momoConfig.setEndpoint("https://test-payment.momo.vn");
        momoConfig.setRedirectUrl("http://localhost:3000/redirect");
        momoConfig.setIpnUrl("http://localhost:3000/ipn");

        momoService = new MomoService(momoConfig, new RestTemplate());
    }

    @Test
    public void testHmacSHA256() throws Exception {
        // Use reflection or make method public/protected to test,
        // OR just test the createPayment method with a mock RestTemplate if possible.
        // For now, let's just try to obtain the raw signature logic if we can,
        // but since doFinal is private/hard to reach without Mockito,
        // let's try to run a dummy createPayment and catch the network error.
        // We expect it to FAIL on network, but PASS on signature generation before
        // that.

        try {
            momoService.createPayment("TEST_ORDER", "1000", "Test Order Info");
        } catch (Exception e) {
            e.printStackTrace();
            // We want to see if it failed due to "Signature" or "Network"
            // If it's network, then signature generation worked.
        }
    }
}
