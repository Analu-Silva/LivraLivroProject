package br.edu.atitus.auth_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.auth_service.components.JwtUtil;
import br.edu.atitus.auth_service.dtos.SigninDTO;
import br.edu.atitus.auth_service.dtos.SigninResponseDTO;
import br.edu.atitus.auth_service.dtos.SignupDTO;
import br.edu.atitus.auth_service.dtos.SignupResponseDTO;
import br.edu.atitus.auth_service.entities.UserAuthEntity;
import br.edu.atitus.auth_service.services.UserAuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private UserAuthService userAuthService;
	private final AuthenticationConfiguration authConfig;

	public AuthController(UserAuthService userAuthService, AuthenticationConfiguration authConfig) {
		super();
		this.userAuthService = userAuthService;
		this.authConfig = authConfig;
	}

	@PostMapping("/signup")
	public ResponseEntity<SignupResponseDTO> signup(@Valid @RequestBody SignupDTO dto) {
		SignupResponseDTO response = userAuthService.registerAccount(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);

	}

	@PostMapping("/signin")
	public ResponseEntity<SigninResponseDTO> signin(@RequestBody SigninDTO signin)
			throws AuthenticationException, Exception {
		authConfig.getAuthenticationManager()
				.authenticate(new UsernamePasswordAuthenticationToken(signin.email(), signin.password()));
		UserAuthEntity user = (UserAuthEntity) userAuthService.loadUserByUsername(signin.email());
		SigninResponseDTO response = new SigninResponseDTO(user,
				JwtUtil.generateToken(user.getEmail(), user.getId(), user.getType()));
		return ResponseEntity.ok(response);

	}


}