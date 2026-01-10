package ma.sieger.orderservice.repositories;

import ma.sieger.orderservice.entities.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
}