package br.edu.atitus.book_service.dtos;

import java.time.Instant;

import org.springframework.http.HttpStatus;

public record ApiErrorResponse(Instant timestamp, Integer status, String error, String message, String path) {

	public ApiErrorResponse(HttpStatus status, String message, String path) {
		this(Instant.now(), status.value(), status.getReasonPhrase(), message, path);

	}

}
