FROM eclipse-temurin:21-jre
VOLUME /tmp
COPY target/gateway-service-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]