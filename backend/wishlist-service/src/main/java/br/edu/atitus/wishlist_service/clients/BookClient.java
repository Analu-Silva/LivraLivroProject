package br.edu.atitus.wishlist_service.clients;

import java.util.UUID;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "book-service")
public interface BookClient {

    @GetMapping("/books/internal/noconverter/{id}")
    BookResponse getBookById(@PathVariable("id") UUID id);

    @GetMapping("/books/internal/{id}/{targetCurrency}")
    BookResponse getBookByIdWithCurrency(
        @PathVariable("id") UUID id,
        @PathVariable("targetCurrency") String targetCurrency
    );
}