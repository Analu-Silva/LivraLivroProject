package br.edu.atitus.user_service.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UserDetailsRequestDTO(

		@Size(max = 2048, message = "URL da imagem muito longo") String userImageUrl,

		@Min(value = 1, message = "Escolha uma das opções fornecidas")
		@Max(value = 3, message = "Escolha uma das opções fornecidas")
		Integer userGenreId,

		@Size(max = 255, message = "Descrição muito longa")
		String description) {

	public UserDetailsRequestDTO {

		if (userImageUrl != null) {
			userImageUrl = userImageUrl.trim();
		}
		
		if (description != null) {
			description = description.trim();
		}
	}
}