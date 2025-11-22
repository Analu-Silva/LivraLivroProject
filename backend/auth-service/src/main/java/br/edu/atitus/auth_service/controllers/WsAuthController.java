package br.edu.atitus.auth_service.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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

	private UserAuthService userAuthService;

	public WsAuthController(UserAuthService userAuthService) {
		super();
		this.userAuthService = userAuthService;
	}

	@PatchMapping("/credentials/{id}")
	public ResponseEntity<CredentialsUpdateDTO> updateCredentials(@PathVariable UUID id,
			@Valid @RequestBody CredentialsUpdateDTO credentials, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		CredentialsUpdateDTO response = userAuthService.updateAccount(id, credentials, UserId, userType);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/credentials/{id}")
	public ResponseEntity<EmailDTO> getEmail(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		EmailDTO email = userAuthService.getUserEmail(id,  UserId, userType);
		return ResponseEntity.ok(email);
	}

	// Deleta a conta de um usuário (menos os pedidos)

	@DeleteMapping("/deleteAccount/{id}")
	public ResponseEntity<Void> deleteAccount(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		userAuthService.deleteUserAccount(id, UserId, userType);

		return ResponseEntity.noContent().build();
	}
}
