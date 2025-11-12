package br.edu.atitus.order_service.dtos;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderDTO(
		
		@Valid
		@NotEmpty(message = "É necessário pelo menos um item")
		List<OrderItemDTO> items,
		
		@NotNull(message = "A forma de pagamento é obrigatória") @Positive(message = "Número do método de pagamento inválido") 
		@Min(value = 1, message = "Número do método de pagamento inválido") 
		@Max(value = 3, message = "Número do método de pagamento inválido")
		Integer paymentMethodId) {

}
