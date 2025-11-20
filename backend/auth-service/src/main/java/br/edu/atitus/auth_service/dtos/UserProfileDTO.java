package br.edu.atitus.auth_service.dtos;

import java.time.LocalDate;
import java.util.UUID;

public record UserProfileDTO(UUID id, String name, String phoneNumber, String cpf, LocalDate dateOfBirth, 
		String userImageUrl, Integer userGenreId, String description) {

}
