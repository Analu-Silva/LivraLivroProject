package br.edu.atitus.auth_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

@RestController
@RequestMapping("/auth")
public class AuthController {

	private UserAuthService service;
	private final AuthenticationConfiguration authConfig;

	public AuthController(UserAuthService service, AuthenticationConfiguration authConfig) {
		super();
		this.service = service;
		this.authConfig = authConfig;
	}

	@PostMapping("/signup")
	public ResponseEntity<SignupResponseDTO> signup(@RequestBody SignupDTO dto) throws Exception {
		SignupResponseDTO response = service.register(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);

	}

	@PostMapping("/signin")
	public ResponseEntity<SigninResponseDTO> PostSignin(@RequestBody SigninDTO signin)
			throws AuthenticationException, Exception {
		authConfig.getAuthenticationManager()
				.authenticate(new UsernamePasswordAuthenticationToken(signin.email(), signin.password()));
		UserAuthEntity user = (UserAuthEntity) service.loadUserByUsername(signin.email());
		SigninResponseDTO response = new SigninResponseDTO(user,
				JwtUtil.generateToken(user.getEmail(), user.getId(), user.getType()));
		return ResponseEntity.ok(response);

	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleException(Exception e) {
		String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cleanMessage);
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<String> handleException(AuthenticationException e) {
		String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(cleanMessage);
	}
}