package br.edu.atitus.auth_service.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record CredentialsUpdateDTO(

		@Size(max = 254, message = "Email não pode ser maior que 254 caracteres")  
		@Email(message = "Email inválido") String email,
		
		@Size(min = 8, max = 256, message = "Senha deve ter entre 8 e 256 caracteres") 
		@JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String password) {

}
