package ma.sieger.orderservice.dtos;

import lombok.Data;
import java.util.Map;

@Data
public class OrderRequestDTO {
    // Key = ProductID, Value = Quantity
    private Map<String, Integer> products;
}