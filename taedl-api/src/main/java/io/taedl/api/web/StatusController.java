package io.taedl.api.web;

import com.google.common.collect.ImmutableMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/status")
public class StatusController {

    @GetMapping(value = "",  produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> pulse() {
        return ImmutableMap.of("pulse", "ok");
    }
}
