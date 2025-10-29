package br.edu.atitus.auth_service.services;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.atitus.auth_service.clients.UserServiceClient;
import br.edu.atitus.auth_service.components.Validator;
import br.edu.atitus.auth_service.dtos.SignupDTO;
import br.edu.atitus.auth_service.dtos.SignupResponseDTO;
import br.edu.atitus.auth_service.dtos.UserProfileDTO;
import br.edu.atitus.auth_service.entities.UserEntity;
import br.edu.atitus.auth_service.entities.UserType;
import br.edu.atitus.auth_service.repositories.UserRepository;

@Service
public class UserService implements UserDetailsService {
	private final UserRepository userRepository;
	private final PasswordEncoder encoder;
	private final UserServiceClient userServiceClient;

	public UserService(UserRepository userRepository, PasswordEncoder encoder, UserServiceClient userServiceClient) {
		super();
		this.userRepository = userRepository;
		this.encoder = encoder;
		this.userServiceClient = userServiceClient;
	}

	private void validate(UserEntity user) throws Exception {
		if (user.getEmail() == null || user.getEmail().isEmpty() || !Validator.validateEmail(user.getEmail()))
			throw new Exception("E-mail informado inválido");
		if (user.getPassword() == null || user.getPassword().isEmpty())
			throw new Exception("Senha informada inválida");

		if (user.getId() != null) {
			if (userRepository.existsByEmailAndIdNot(user.getEmail(), user.getId()))
				throw new Exception("Já existe usuário com este e-mail");
		} else {
			if (userRepository.existsByEmail(user.getEmail()))
				throw new Exception("Já existe usuário com este e-mail");
		}
		// TODO validar se usuário tem permissão para o tipo escolhido
	}

	private void format(UserEntity user) throws Exception {
		user.setPassword(encoder.encode(user.getPassword()));
	}

	@Transactional
	public UserEntity save(UserEntity user) throws Exception {
		if (user == null)
			throw new Exception("Objeto nulo");
		validate(user);
		format(user);
		return userRepository.save(user);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		var user = userRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com este e-mail"));
		return user;
	}

	@Transactional
	public SignupResponseDTO register(SignupDTO dto) throws Exception {
		UserEntity authUser = new UserEntity();
		authUser.setEmail(dto.email());
		authUser.setPassword(dto.password());
		authUser.setType(UserType.Common);

		UserEntity savedUser = save(authUser);
		UUID newUserId = savedUser.getId();

		UserProfileDTO profileData = new UserProfileDTO(newUserId, dto.name(), dto.phoneNumber(), dto.cpf(), dto.dateOfBirth());

		try {
			userServiceClient.createProfile(profileData);

		} catch (Exception e) {
			throw new RuntimeException("Não foi possível fazer o cadastro");
		}
		return new SignupResponseDTO(savedUser.getId(), dto.name(), savedUser.getEmail(), savedUser.getType(),
				dto.cpf(), dto.phoneNumber(), dto.dateOfBirth(), savedUser.getAuthorities(), savedUser.isEnabled(),
				savedUser.isAccountNonLocked(), savedUser.isAccountNonExpired(), savedUser.isCredentialsNonExpired());
	}
}
