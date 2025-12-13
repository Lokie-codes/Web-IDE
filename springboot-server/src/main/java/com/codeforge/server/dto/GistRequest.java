package com.codeforge.server.dto;

import lombok.Data;

@Data
public class GistRequest {
    private String title;
    private String language;
    private String code;
    private String theme;
}
