package br.edu.atitus.wishlist_service.clients;

import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "book-service")
public interface BookClient {

    // Endpoint padrão do book-service
    @GetMapping("/ws/books/{id}")
    BookResponse getBookById(@PathVariable("id") UUID id);

    // Endpoint com conversão de moeda
    @GetMapping("/ws/books/{id}/currency")
    BookResponse getBookByIdWithCurrency(
        @PathVariable("id") UUID id,
        @RequestParam("targetCurrency") String targetCurrency
    );
}
