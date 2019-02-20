package io.taedl.api.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.sql.SQLException;

@Slf4j
@ControllerAdvice
public class AppControllerAdvice extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ClassNotFoundException.class})
    protected ResponseEntity<Object> handleClassNotFoundException(ClassNotFoundException ex) {
        log.info("Caught ClassNotFoundException {}", ex.getMessage());
        return new ResponseEntity<Object>("Class not found: ".concat(ex.getMessage()), HttpStatus.FAILED_DEPENDENCY);
    }

    @ExceptionHandler(value = {SQLException.class})
    protected ResponseEntity<Object> handleSQLException(SQLException sqlEx, WebRequest request) {
        log.info("Caught SQLException {}", sqlEx.getMessage());
        return new ResponseEntity(sqlEx.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
