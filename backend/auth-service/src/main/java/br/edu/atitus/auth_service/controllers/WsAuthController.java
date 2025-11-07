package br.edu.atitus.auth_service.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.auth_service.dtos.CredentialsUpdateDTO;
import br.edu.atitus.auth_service.dtos.EmailDTO;
import br.edu.atitus.auth_service.services.UserAuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ws/auth")
public class WsAuthController {

	private UserAuthService service;

	public WsAuthController(UserAuthService service) {
		super();
		this.service = service;
	}

	private void validateUserType(Integer userType) {
		if (userType != 0 && userType != 1)
			throw new SecurityException("Usuário sem permissão");
	}

	private void validateUserTypeAndById(UUID id, UUID UserId, Integer userType) {

		if (userType != 0 && !id.equals(UserId))
			throw new SecurityException("Você não está autorizado a modificar dados de outros usuários");
	}

	@PatchMapping("/credentials/{id}")
	public ResponseEntity<CredentialsUpdateDTO> updateCredentials(@PathVariable UUID id,
			@Valid @RequestBody CredentialsUpdateDTO credentials, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		CredentialsUpdateDTO response = service.updateAccount(id, credentials);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/credentials/{id}")
	public ResponseEntity<EmailDTO> getEmail(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		EmailDTO email = service.getUserEmail(id);
		return ResponseEntity.ok(email);
	}

	// TODO Deleta Conta

}
