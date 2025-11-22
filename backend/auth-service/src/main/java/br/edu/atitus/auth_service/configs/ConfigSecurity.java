package br.edu.atitus.auth_service.configs;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class ConfigSecurity {
	@Bean
	SecurityFilterChain getFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(request -> {
			CorsConfiguration config = new CorsConfiguration();
			config.setAllowedOrigins(Arrays.asList("*"));
			config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
			config.setAllowedHeaders(Arrays.asList("*"));
			config.setAllowCredentials(true);
			return config;
		}))
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/auth/**").permitAll()
						.requestMatchers("/internal/**").permitAll()
						// .requestMatchers("/auth*","/auth/**","/swagger-ui*", "swagger-ui/**",
						// "/v3/api-docs/**").permitAll()
						// .requestMatchers(HttpMethod.OPTIONS).permitAll()
						.requestMatchers("/ws**", "/ws/**").permitAll().anyRequest().authenticated());
				//.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	PasswordEncoder getpPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
