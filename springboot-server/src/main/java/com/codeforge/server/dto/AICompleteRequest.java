package com.codeforge.server.dto;

import lombok.Data;

@Data
public class AICompleteRequest {
    private String prompt;
    private String code;
    private String language;
}
