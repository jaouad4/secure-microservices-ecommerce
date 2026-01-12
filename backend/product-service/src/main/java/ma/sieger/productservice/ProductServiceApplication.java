package ma.sieger.productservice;

import ma.sieger.productservice.dtos.ProductRequestDTO;
import ma.sieger.productservice.repository.ProductRepository;
import ma.sieger.productservice.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(ProductService productService, ProductRepository productRepository) {
        return args -> {
            // Only seed data if the database is empty
            if (productRepository.count() == 0) {
                productService.createProduct(new ProductRequestDTO(
                        "Laptop HP EliteBook",
                        "PC Portable professionnel performant",
                        1200.00,
                        10,
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
                ));

                productService.createProduct(new ProductRequestDTO(
                        "Smartphone Samsung S24",
                        "Dernier modèle Samsung avec AI",
                        900.00,
                        25,
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
                ));

                productService.createProduct(new ProductRequestDTO(
                        "Ecran Dell 27 pouces",
                        "Moniteur 4K Ultra HD",
                        350.00,
                        5,
                        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"
                ));

                System.out.println("Test data initialized in Product Database!");
            } else {
                System.out.println("Product Database already contains data, skipping initialization.");
            }
        };
    }

}
