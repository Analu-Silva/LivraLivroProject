package br.edu.atitus.wishlist_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "currency-service")
public interface CurrencyClient {
    @GetMapping("/currency/convert")
    Double getCurrency(
        @RequestParam("amount") Double amount,
        @RequestParam("from") String from,
        @RequestParam("to") String to
    );
}
