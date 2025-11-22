package br.edu.atitus.cart_service.clients;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record BookResponse(UUID id, List<BookImageUrlResponse> imageUrls, String title, BigDecimal price, String currency,
        Integer numberOfPages, List<BookGenreResponse> genre, BookConditionResponse bookCondition,
        Integer numberOfYears, String isbn, BookLanguageResponse bookLanguage, String publisher, Integer stock, UUID seller, 
        String description, String enviroment, BigDecimal convertedPrice) {}