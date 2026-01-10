package ma.sieger.orderservice.dtos;

import lombok.Data;
import ma.sieger.orderservice.model.Product;

@Data
public class OrderLineItemDTO {
    private Long id;
    private Product product;
    private int quantity;
    private double price;
    private double totalLinePrice;
}