package br.edu.atitus.order_service.configs;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import br.edu.atitus.order_service.dtos.ApiErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private String cleanMessage(String message) {
		if (message == null) {
			return "Ocorreu um erro";
		}

		return message.replaceAll("[\\r\\n]", " ");
	}

	private String getPath(WebRequest request) {
		return request.getDescription(false).replace("uri=", "");
	}

	@ExceptionHandler(SecurityException.class)
	public ResponseEntity<ApiErrorResponse> handleSecurityException(SecurityException e, WebRequest request) {
		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.FORBIDDEN, cleanMessage(e.getMessage()),
				getPath(request));
		return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiErrorResponse> handleBadRequestException(Exception e, WebRequest request) {

		if (e instanceof SecurityException) {
			return handleSecurityException((SecurityException) e, request);
		}

		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.BAD_REQUEST, cleanMessage(e.getMessage()),
				getPath(request));

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ApiErrorResponse> handleRuntimeException(RuntimeException e, WebRequest request) {

		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
				"Ocorreu um erro interno do servidor", getPath(request));

		return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
