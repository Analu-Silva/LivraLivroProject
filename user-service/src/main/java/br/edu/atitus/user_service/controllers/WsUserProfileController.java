package br.edu.atitus.user_service.controllers;

import java.util.UUID;

import javax.security.sasl.AuthenticationException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.user_service.dtos.UserAddressDTO;
import br.edu.atitus.user_service.dtos.UserDTO;
import br.edu.atitus.user_service.dtos.UserDetailsRequestDTO;
import br.edu.atitus.user_service.dtos.UserDetailsResponseDTO;
import br.edu.atitus.user_service.dtos.UserUpdateDTO;
import br.edu.atitus.user_service.entities.UserAddressEntity;
import br.edu.atitus.user_service.services.UserProfileService;

@RestController
@RequestMapping("/ws/profile")
public class WsUserProfileController {

	private final UserProfileService userProfileService;

	public WsUserProfileController(UserProfileService userProfileService) {
		super();
		this.userProfileService = userProfileService;
	}

	// Informaçoes Gerais do Usuário

	@PatchMapping("/{id}/info")
	public ResponseEntity<UserUpdateDTO> updateUserInfo(@PathVariable UUID id, @RequestBody UserUpdateDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Email") String emailUser,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserUpdateDTO info = userProfileService.alterInfo(id, dto);

		return ResponseEntity.ok(info);
	}

	@GetMapping("/{id}/info")
	public ResponseEntity<UserDTO> getUserInfo(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserDTO info = userProfileService.getInfoById(id);
		return ResponseEntity.ok(info);
	}

	// Endereço

	@PostMapping("/{id}/address")
	public ResponseEntity<UserAddressEntity> createAddress(@PathVariable UUID id, @RequestBody UserAddressDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Email") String emailUser,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserAddressEntity CreateAddress = userProfileService.addAddress(id, dto);

		return ResponseEntity.status(201).body(CreateAddress);
	}

	@PatchMapping("/{id}/address")
	public ResponseEntity<UserAddressEntity> updateAddress(@PathVariable UUID id, @RequestBody UserAddressDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Email") String emailUser,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserAddressEntity UpdateAddress = userProfileService.alterAddress(id, dto);

		return ResponseEntity.ok(UpdateAddress);
	}

	@GetMapping("/{id}/address")
	public ResponseEntity<UserAddressEntity> getAddress(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserAddressEntity getAddress = userProfileService.getAddressById(id);
		return ResponseEntity.ok(getAddress);
	}

	// Detalhes Usuario

	@PostMapping("/{id}/details")
	public ResponseEntity<UserDetailsResponseDTO> createDetails(@PathVariable UUID id, @RequestBody UserDetailsRequestDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Email") String emailUser,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserDetailsResponseDTO createDetails = userProfileService.addDetails(id, dto);

		return ResponseEntity.status(201).body(createDetails);
	}

	@PatchMapping("/{id}/details")
	public ResponseEntity<UserDetailsResponseDTO> updateDetails(@PathVariable UUID id, @RequestBody UserDetailsRequestDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Email") String emailUser,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserDetailsResponseDTO updateDetails = userProfileService.updateDetails(id, dto);

		return ResponseEntity.ok(updateDetails);
	}

	@GetMapping("/{id}/details")
	public ResponseEntity<UserDetailsResponseDTO> getDetails(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		UserDetailsResponseDTO details = userProfileService.getDetailsById(id);

		return ResponseEntity.ok(details);
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<String> handlerAuth(AuthenticationException e) {
		String message = e.getMessage().replaceAll("[\\r\\n]", "");
		return ResponseEntity.status(403).body(message);
	}

}
