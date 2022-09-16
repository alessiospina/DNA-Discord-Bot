/* eslint-disable prettier/prettier */

export class ServerResponse<T> {
    static readonly SUCCESS = 'success';
    static readonly FAILED = 'failed';
    data: T;
    result: string;
    error: string[];

    constructor(result?: string, data?: T, errors?: string[]) {
        this.result = result;
        this.data = data;
        this.error= errors ?? [];
    }

    static success<T>(data: T, result?: string) {
        return new ServerResponse(
            result ?? ServerResponse.SUCCESS,
            data
        );
    }

    static failed(errors?: string[], ) {
        return new ServerResponse(ServerResponse.FAILED, undefined, errors);
    }
}
