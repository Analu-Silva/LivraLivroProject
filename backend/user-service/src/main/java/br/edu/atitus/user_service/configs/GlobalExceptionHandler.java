package br.edu.atitus.user_service.configs;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import br.edu.atitus.user_service.exceptions.InvalidDataException;
import br.edu.atitus.user_service.exceptions.ResourceAlreadyExistsException;
import br.edu.atitus.user_service.exceptions.ResourceNotFoundException;
import br.edu.atitus.user_service.exceptions.ServiceCommunicationException;
import br.edu.atitus.user_service.dtos.ApiErrorResponse;

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

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e,
			WebRequest request) {

		String fieldErrors = e.getBindingResult().getFieldErrors().stream()
				.map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
				.collect(Collectors.joining(", "));

		String globalErrors = e.getBindingResult().getGlobalErrors().stream()
				.map(objectError -> objectError.getObjectName() + ": " + objectError.getDefaultMessage())
				.collect(Collectors.joining(", "));

		String errors;

		if (!globalErrors.isEmpty() && !fieldErrors.isEmpty()) {
			errors = globalErrors + ", " + fieldErrors;
		} else if (!globalErrors.isEmpty()) {
			errors = globalErrors;
		} else {
			errors = fieldErrors;
		}

		if (errors.isEmpty()) {
			errors = "Erro de Validação";
		}

		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.BAD_REQUEST, errors, getPath(request));

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(InvalidDataException.class)
	public ResponseEntity<ApiErrorResponse> handleInvalidDataException(InvalidDataException e, WebRequest request) {
		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.BAD_REQUEST, cleanMessage(e.getMessage()),
				getPath(request));

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ResourceAlreadyExistsException.class)
	public ResponseEntity<ApiErrorResponse> handleResourceAlreadyExistsException(ResourceAlreadyExistsException e,
			WebRequest request) {
		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.CONFLICT, cleanMessage(e.getMessage()),
				getPath(request));

		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e,
			WebRequest request) {
		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.NOT_FOUND, cleanMessage(e.getMessage()),
				getPath(request));

		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(ServiceCommunicationException.class)
	public ResponseEntity<ApiErrorResponse> handleServiceCommunicationException(ServiceCommunicationException e,
			WebRequest request) {
		ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.SERVICE_UNAVAILABLE,
				cleanMessage(e.getMessage()), getPath(request));

		return new ResponseEntity<>(errorResponse, HttpStatus.SERVICE_UNAVAILABLE);
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
