package br.edu.atitus.user_service.dtos;

import java.time.LocalDate;
import java.util.UUID;

public record UserDTO(UUID id, String name, String phoneNumber, String cpf, LocalDate dateOfBirth) {
	
}
