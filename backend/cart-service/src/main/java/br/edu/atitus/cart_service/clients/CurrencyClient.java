package br.edu.atitus.cart_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "currency-service")
public interface CurrencyClient {
    
    @GetMapping("/currency/{amount}/{from}/{to}")
    CurrencyResponse getCurrency(
        @PathVariable("amount") Double amount,
        @PathVariable("from") String from,
        @PathVariable("to") String to
    );
}