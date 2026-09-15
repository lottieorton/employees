package io.nology.employees.common.dtos;

import java.util.List;

public class PageResponse<T> {

    private int currentPage;
    private int totalPages;
    private long totalResults;
    private int resultsPerPage;
    private Integer nextPage;
    private Integer previousPage;
    private List<T> data;

    public PageResponse() {
    }
    
    public PageResponse(int currentPage, int totalPages, long totalResults, int resultsPerPage, Integer nextPage,
            Integer previousPage, List<T> data) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.resultsPerPage = resultsPerPage;
        this.nextPage = nextPage;
        this.previousPage = previousPage;
        this.data = data;
    }

    public int getCurrentPage() {
        return currentPage;
    }
    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }
    public int getTotalPages() {
        return totalPages;
    }
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    public long getTotalResults() {
        return totalResults;
    }
    public void setTotalResults(long totalResults) {
        this.totalResults = totalResults;
    }
    public int getResultsPerPage() {
        return resultsPerPage;
    }
    public void setResultsPerPage(int resultsPerPage) {
        this.resultsPerPage = resultsPerPage;
    }
    public Integer getNextPage() {
        return nextPage;
    }
    public void setNextPage(Integer nextPage) {
        this.nextPage = nextPage;
    }
    public Integer getPreviousPage() {
        return previousPage;
    }
    public void setPreviousPage(Integer previousPage) {
        this.previousPage = previousPage;
    }
    public List<T> getData() {
        return data;
    }
    public void setData(List<T> data) {
        this.data = data;
    }

    
}
