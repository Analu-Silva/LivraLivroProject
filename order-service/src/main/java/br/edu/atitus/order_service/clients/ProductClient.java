package br.edu.atitus.order_service.clients;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/books/noconverter/{id}")
    ProductResponse getProductById(@PathVariable UUID id);
    
    @GetMapping("/books/{id}/{targetCurrency}")
    ProductResponse getProductByIdWithCurrency(@PathVariable UUID id, @PathVariable String targetCurrency);
}