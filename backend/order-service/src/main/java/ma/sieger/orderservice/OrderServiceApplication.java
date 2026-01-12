package ma.sieger.orderservice;

import ma.sieger.orderservice.clients.ProductRestClient;
import ma.sieger.orderservice.dtos.OrderRequestDTO;
import ma.sieger.orderservice.dtos.OrderResponseDTO;
import ma.sieger.orderservice.model.Product;
import ma.sieger.orderservice.services.OrderService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.Map;

@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(OrderService orderService, ProductRestClient productRestClient) {
        return args -> {
            System.out.println("Waiting for Discovery Service...");
            Thread.sleep(3000);

            try {
                // 1. Fetch products from the Remote Product Service
                List<Product> products = productRestClient.allProducts();

                if (products.isEmpty()) {
                    System.out.println("⚠No products found in Product Service. Cannot create test order.");
                    return;
                }

                // 2. Pick the first product to buy
                String productId = products.get(0).getId();
                String productName = products.get(0).getName();
                System.out.println("🛒 Found Product: " + productName + " (ID: " + productId + ")");

                // 3. Create an Order Request
                OrderRequestDTO request = new OrderRequestDTO();
                // Buy 1 unit of this product
                request.setProducts(Map.of(productId, 1));

                // 4. Place the Order (using a test userId for CommandLineRunner)
                OrderResponseDTO savedOrder = orderService.placeOrder(request, "test-user-id");

                // 5. Success!
                System.out.println("✅ TEST SUCCESS! Order Created via Feign Client.");
                System.out.println("Order ID: " + savedOrder.getId());
                System.out.println("Total Amount: " + savedOrder.getTotalAmount());
                System.out.println("Product in Order: " + savedOrder.getOrderLines().get(0).getProduct().getName());

            } catch (Exception e) {
                System.err.println("TEST FAILED: Could not connect to Product Service.");
                System.err.println("Reason: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
