package br.edu.atitus.auth_service.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record SignupDTO(

		@NotBlank(message = "O nome é obrigatório") @Size(min = 3, max = 255, message = "Insira um nome válido") String name,

		@NotBlank(message = "O email é obrigatório") @Size(max = 254, message = "Email não pode ser maior que 254 caracteres")
		@Email(message = "Email inválido") String email,

		@NotBlank(message = "A senha é obrigatória") 
		@Size(min = 8, max = 256, message = "Senha deve ter entre 8 e 256 caracteres") String password,

		@NotBlank(message = "O número de telefone é obrigatório") 
		@Size(min = 11, max = 11, message = "Insira número de celular válido") String phoneNumber,

		@NotBlank(message = "O CPF é obrigatório") @Size(min = 11, max = 11, message = "CPF deve ter 11 caracteres") String cpf,

		@NotNull(message = "A data de nascimento é obrigatória") 
		@Past(message = "Data de nascimento inválida") LocalDate dateOfBirth,

		@Size(max = 2048, message = "URL da imagem muito longo") String userImageUrl,
		
		@Min(value = 1, message = "Escolha uma das opções fornecidas")
		@Max(value = 3, message = "Escolha uma das opções fornecidas")
		Integer userGenreId,
		
		@Size(max = 255, message = "Descrição muito longa")
		String description) {

	public SignupDTO {

		if (name != null) {
			name = name.trim();
		}

		if (email != null) {
			email = email.trim();
		}

		if (phoneNumber != null) {
			phoneNumber = phoneNumber.trim();
		}

		if (cpf != null) {
			cpf = cpf.trim();
		}
		
		if (userImageUrl != null) {
		userImageUrl = userImageUrl.trim();
		}
		
		if (description != null) {
			description = description.trim();
		}

	}

}
