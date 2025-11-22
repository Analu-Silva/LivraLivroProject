package br.edu.atitus.auth_service.dtos;

import java.time.LocalDate;
import java.util.Collection;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;

import br.edu.atitus.auth_service.entities.UserType;

public record SignupResponseDTO(
		UUID id, 
		String name, 
		String email, 
		UserType type, 
		
		String cpf,
		String phoneNumber, 
		LocalDate dateOfBirth,
		String userImageUrl, 
		Integer userGenreId, 
		String description,
		
		Collection<? extends GrantedAuthority> authorities,
		boolean enabled, 
		boolean accountNonLocked, 
		boolean accountNonExpired,
		boolean credentialsNonExpired
		) {

}
