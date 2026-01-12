package ma.sieger.orderservice.clients;

import ma.sieger.orderservice.model.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductRestClient {

    @GetMapping("/api/products/{id}")
    Product findProductById(@PathVariable("id") String id);

    @GetMapping("/api/products")
    List<Product> allProducts();

    @PutMapping("/api/products/{id}/decrease-stock")
    Product decreaseStock(@PathVariable("id") String id, @RequestParam("quantity") int quantity);
}