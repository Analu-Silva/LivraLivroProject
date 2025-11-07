package br.edu.atitus.auth_service.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SigninDTO(

		@NotBlank(message = "O email é obrigatório") @Size(max = 254, message = "Email não pode ser maior que 254 caracteres")
		@Email(message = "Email inválido") String email,

		@NotBlank(message = "A senha é obrigatória") 
		@Size(min = 8, max = 256, message = "Senha deve ter entre 8 e 256 caracteres") String password) {

}
