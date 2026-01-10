package ma.sieger.orderservice.mappers;

import ma.sieger.orderservice.dtos.OrderLineItemDTO;
import ma.sieger.orderservice.dtos.OrderResponseDTO;
import ma.sieger.orderservice.entities.Order;
import ma.sieger.orderservice.entities.OrderLine;
import ma.sieger.orderservice.model.Product;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponseDTO fromOrder(Order order) {
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(order.getId());
        response.setDate(order.getDate());
        response.setStatus(order.getStatus());

        // Calculate total amount = sum of (price * quantity) for all lines
        if (order.getOrderLines() != null) {
            double total = order.getOrderLines().stream()
                    .mapToDouble(line -> line.getPrice() * line.getQuantity())
                    .sum();
            response.setTotalAmount(total);
        }

        return response;
    }

    public OrderLineItemDTO fromOrderLine(OrderLine orderLine, Product product) {
        OrderLineItemDTO dto = new OrderLineItemDTO();
        dto.setId(orderLine.getId());
        dto.setProduct(product); // We attach the full product info here
        dto.setQuantity(orderLine.getQuantity());
        dto.setPrice(orderLine.getPrice());
        dto.setTotalLinePrice(orderLine.getPrice() * orderLine.getQuantity());
        return dto;
    }
}