package br.edu.atitus.gateway_service.configs;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiGatewayConfig {

	@Bean
	RouteLocator gatRoutes(RouteLocatorBuilder builder) {
		return builder.routes()
//				.route(p -> p.path("/get")
//						.filters(f -> f.addRequestHeader("X-USER-NAME", "username")
//						.addRequestParameter("name", "fulano")).uri("http://httpbin.org:80"))
				.route(p -> p.path("/books/**").uri("lb://book-service"))
				.route(p -> p.path("/ws/books/**").uri("lb://book-service"))
				// http://localhost:8080 (era assim antes do lb...)
				// Eu quero que redirecione para o product-service para se eu tiver + instancias
				.route(p -> p.path("/currency/**").uri("lb://currency-service"))
				.route(p -> p.path("/greeting/**").uri("lb://greeting-service"))
				.route(p -> p.path("/auth/**").uri("lb://auth-service"))
				.route(p -> p.path("/ws/auth/**").uri("lb://auth-service"))
				.route(p -> p.path("/profile/**").uri("lb://user-service"))
				.route(p -> p.path("/ws/profile/**").uri("lb://user-service"))
				.route(p -> p.path("/ws/orders/**").uri("lb://order-service")).build();
	}

}
