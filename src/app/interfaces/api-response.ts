export interface ApiResponse {
    items: any[]
    page?: number,
    perPage?: number,
    total?: number,
    totalPages?: number,
    message?:string
}
