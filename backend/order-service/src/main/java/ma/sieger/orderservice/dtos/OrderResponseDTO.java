package ma.sieger.orderservice.dtos;

import lombok.Data;
import ma.sieger.orderservice.enums.OrderStatus;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderResponseDTO {
    private String id;
    private LocalDate date;
    private OrderStatus status;
    private double totalAmount;
    private List<OrderLineItemDTO> orderLines;
}