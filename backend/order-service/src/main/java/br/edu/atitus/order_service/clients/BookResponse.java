package br.edu.atitus.order_service.clients;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

record BookConditionResponse(Integer id, String condition) {
}

record BookGenreResponse(Integer id, String genre) {
}

record BookImageUrlResponse(UUID id, String imageUrl) {
}

record BookLanguageResponse(Integer id, String language) {
}

public record BookResponse(UUID id, List<BookImageUrlResponse> imageUrls, String title, BigDecimal price, String currency,
		Integer numberOfPages, List<BookGenreResponse> genre, BookConditionResponse bookCondition,
		Integer numberOfYears, String isbn, BookLanguageResponse bookLanguage, String publisher, Integer stock, UUID seller, 
		String description, String enviroment, BigDecimal convertedPrice) {
}
