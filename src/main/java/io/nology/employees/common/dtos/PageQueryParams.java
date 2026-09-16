package io.nology.employees.common.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class PageQueryParams {
    @Min(1)
    private Integer page = 1;

    @Min(1)
    @Max(20)
    private Integer size = 10;

    private boolean unpaged = false;

    public Integer getPage() {
        return page;
    }
    public void setPage(Integer page) {
        this.page = page;
    }
    public Integer getSize() {
        return size;
    }
    public void setSize(Integer size) {
        this.size = size;
    }
    public boolean isUnpaged() {
        return unpaged;
    }
    public void setUnpaged(boolean unpaged) {
        this.unpaged = unpaged;
    }
    
}
