package br.edu.atitus.auth_service.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

@RestController
@RequestMapping("/ws/auth")
public class WsAuthController {

	private UserAuthService service;

	public WsAuthController(UserAuthService service) {
		super();
		this.service = service;
	}

	@PatchMapping("/credentials/{id}")
	public ResponseEntity<CredentialsUpdateDTO> updateCredentials(@PathVariable UUID id,
			@RequestBody CredentialsUpdateDTO credentials, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new SecurityException("Usuário sem permissão");

		if (userType != 0 && !id.equals(UserId))
			throw new SecurityException("Você não está autorizado a modificar dados de outros usuários");

		CredentialsUpdateDTO response = service.updateAccount(id, credentials);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/credentials/{id}")
	public ResponseEntity<EmailDTO> getEmail(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new SecurityException("Usuário sem permissão");

		if (userType != 0 && !id.equals(UserId))
			throw new SecurityException("Você não está autorizado a modificar dados de outros usuários");

		EmailDTO email = service.getUserEmail(id);
		return ResponseEntity.ok(email);
	}

	// TODO Deleta Conta

}
