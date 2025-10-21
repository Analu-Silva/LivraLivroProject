package br.edu.atitus.order_service.clients;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

record BookConditionResponse(Integer id, String condition) {}

record BookGenreResponse(Integer id, String genre) {}

public record ProductResponse(
	    UUID id,
	    String imageUrl,
	    String title, 
	    BigDecimal price,
	    String currency,
	    Integer numberOfPages,
	    List<BookGenreResponse> genre,
	    BookConditionResponse bookCondition,
	    Integer numberOfYears,
	    String isbn,
	    String publisher,
	    Integer stock,
	    UUID seller,
	    String description,
	    String enviroment,
	    BigDecimal convertedPrice
	) {}
