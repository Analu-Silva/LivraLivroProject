package br.edu.atitus.order_service.dtos;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemDTO(
		
		@NotNull(message = "O id do livro é obrigatório")
		UUID bookId,
		
		@NotNull(message = "A quantidade é obrigatória")
		@Min(value = 1, message = "A quantidade mínima é um") 
		@Max(value = 50, message = "A quantidade máxima é 50") 
		Integer quantity) {

}
