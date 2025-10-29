package br.edu.atitus.user_service.dtos;

import java.time.LocalDate;
import java.util.UUID;

public record UserUpdateDTO(UUID id, String name, String phoneNumber,  LocalDate dateOfBirth) {
	
}
