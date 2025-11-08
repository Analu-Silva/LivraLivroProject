package br.edu.atitus.user_service.dtos;

import jakarta.validation.constraints.Size;

public record UserAddressUpdateDTO(
		
		@Size(min = 8, max = 8, message = "CEP deve ter oito dígitos")
		String cep, 
		
		@Size(min = 3, max = 36, message = "Insira nome de cidade válido")
		String city, 
		
		@Size(min = 2, max = 2, message = "Estado deve ter dois caracteres")
		String state,
		
		@Size(max = 60, message = "Insira nome de bairro válido")
		String neighborhood, 
		
		@Size(max = 72, message = "Insira um logradouro válido")
		String street, 
		
		@Size(max = 20, message = "Insira número da residência válido")
		String streetNumber, 
		
		@Size(max = 255, message = "Complemento não pode ser maior que 255 caracteres")
		String complement) {
	
	public UserAddressUpdateDTO {

		if (cep != null) {
			cep = cep.trim();
		}
		if (city != null) {
			city = city.trim();
		}
		if (state != null) {
			state = state.trim();
		}
		if (neighborhood != null) {
			neighborhood = neighborhood.trim();
		}
		if (street != null) {
			street = street.trim();
		}
		if (streetNumber != null) {
			streetNumber = streetNumber.trim();
		}
		if (complement != null) {
			complement = complement.trim();
		}
	}
}
