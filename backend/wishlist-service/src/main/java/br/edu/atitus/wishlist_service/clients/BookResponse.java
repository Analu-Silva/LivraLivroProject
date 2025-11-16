package br.edu.atitus.wishlist_service.clients;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

record BookConditionResponse(Integer id, String condition) {
}

record BookGenreResponse(Integer id, String genre) {
}

public record BookResponse(UUID id, String imageUrl, String title, BigDecimal price, String currency,
		Integer numberOfPages, List<BookGenreResponse> genre, BookConditionResponse bookCondition,
		Integer numberOfYears, String isbn, String publisher, Integer stock, UUID seller, String description,
		String enviroment, BigDecimal convertedPrice) {
}

