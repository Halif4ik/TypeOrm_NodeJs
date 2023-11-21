export interface GeneralResponse<T> {
    status_code: number;
    detail: T;
    result: string;
}
