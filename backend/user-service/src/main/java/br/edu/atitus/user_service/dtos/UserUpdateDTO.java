package br.edu.atitus.user_service.dtos;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(UUID id,
	 
		@Size(min = 3, max = 255, message = "Insira um nome válido") String name,

		@Size(min = 11, max = 11, message = "Insira número de celular válido") String phoneNumber,
 
		@Past(message = "Data de nascimento inválida") LocalDate dateOfBirth) {

}
