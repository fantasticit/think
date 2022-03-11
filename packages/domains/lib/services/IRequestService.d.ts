export interface IResponse<T> {
    data: T | null;
    msg: string | null;
    statusCode: number;
    success: boolean;
}
export declare abstract class IRequestService {
    abstract get<R>(url: string, config?: unknown): Promise<R>;
    abstract delete<R>(url: string, config?: unknown): Promise<R>;
    abstract head<R>(url: string, config?: unknown): Promise<R>;
    abstract options<R>(url: string, config?: unknown): Promise<R>;
    abstract post<R>(url: string, data?: unknown, config?: unknown): Promise<R>;
    abstract put<R>(url: string, data?: unknown, config?: unknown): Promise<R>;
    abstract patch<R>(url: string, data?: unknown, config?: unknown): Promise<R>;
}
