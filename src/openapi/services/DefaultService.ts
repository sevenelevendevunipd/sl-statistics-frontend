/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountResponse_bf74676 } from '../models/CountResponse_bf74676';
import type { LogDelete_a39162f } from '../models/LogDelete_a39162f';
import type { LogFrequency_baae32a } from '../models/LogFrequency_baae32a';
import type { LogFrequencyParams_1d29c35 } from '../models/LogFrequencyParams_1d29c35';
import type { LogOverview_91de17a } from '../models/LogOverview_91de17a';
import type { LogUpload_0b050de } from '../models/LogUpload_0b050de';
import type { StoredLogList_c682361 } from '../models/StoredLogList_c682361';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * upload_log <PUT>
     * @param formData
     * @returns CountResponse_bf74676 OK
     * @throws ApiError
     */
    public static putApiLog(
        formData?: LogUpload_0b050de,
    ): CancelablePromise<CountResponse_bf74676> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/log',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                422: `Unprocessable Entity`,
            },
        });
    }

    /**
     * delete_log <DELETE>
     * @param requestBody
     * @returns CountResponse_bf74676 OK
     * @throws ApiError
     */
    public static deleteApiLog(
        requestBody?: LogDelete_a39162f,
    ): CancelablePromise<CountResponse_bf74676> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/log',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }

    /**
     * list_logs <GET>
     * @returns StoredLogList_c682361 OK
     * @throws ApiError
     */
    public static getApiLogList(): CancelablePromise<StoredLogList_c682361> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/log_list',
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }

    /**
     * selected_logs_overview <GET>
     * @param start
     * @param end
     * @returns LogOverview_91de17a OK
     * @throws ApiError
     */
    public static getApiOverview(
        start: string,
        end: string,
    ): CancelablePromise<LogOverview_91de17a> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/overview',
            query: {
                'start': start,
                'end': end,
            },
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }

    /**
     * log_frequency <POST>
     * @param requestBody
     * @returns LogFrequency_baae32a OK
     * @throws ApiError
     */
    public static postApiFrequency(
        requestBody?: LogFrequencyParams_1d29c35,
    ): CancelablePromise<LogFrequency_baae32a> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/frequency',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }

}
