package br.edu.atitus.user_service.dtos;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record UserDTO(
		
		UUID id,

		@NotBlank(message = "O nome é obrigatório") 
		@Size(min = 3, max = 255, message = "Insira um nome válido") String name,

		@NotBlank(message = "O número de telefone é obrigatório")
		@Size(min = 11, max = 11, message = "Insira número de celular válido") String phoneNumber,

		@NotBlank(message = "O CPF é obrigatório") 
		@Size(min = 11, max = 11, message = "CPF deve ter 11 caracteres") String cpf,

		@NotNull(message = "A data de nascimento é obrigatória") 
		@Past(message = "Data de nascimento inválida") LocalDate dateOfBirth) {

	public UserDTO {

		if (name != null) {
			name = name.trim();
		}
		if (phoneNumber != null) {
			phoneNumber = phoneNumber.trim();
		}
		if (cpf != null) {
			cpf = cpf.trim();
		}
	}
}
