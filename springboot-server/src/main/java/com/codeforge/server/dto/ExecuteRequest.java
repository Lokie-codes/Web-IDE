package com.codeforge.server.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExecuteRequest {
    private String language;
    private String version;
    private String code;
    private String stdin;
    private List<String> args;
}
