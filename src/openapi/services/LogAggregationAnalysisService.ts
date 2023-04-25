/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LogFrequency_baae32a } from '../models/LogFrequency_baae32a';
import type { LogFrequencyParams_1d29c35 } from '../models/LogFrequencyParams_1d29c35';
import type { LogOverview_91de17a } from '../models/LogOverview_91de17a';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LogAggregationAnalysisService {

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
