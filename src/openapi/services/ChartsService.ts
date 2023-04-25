/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChartFilterData_4aaacf4 } from '../models/ChartFilterData_4aaacf4';
import type { FirmwareChartParams_481408c } from '../models/FirmwareChartParams_481408c';
import type { Histogram_3ff3b0d } from '../models/Histogram_3ff3b0d';
import type { TimeChartParams_e89b783 } from '../models/TimeChartParams_e89b783';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChartsService {

    /**
     * chart_filters <GET>
     * @param start
     * @param end
     * @returns ChartFilterData_4aaacf4 OK
     * @throws ApiError
     */
    public static getApiChartsFilters(
        start: string,
        end: string,
    ): CancelablePromise<ChartFilterData_4aaacf4> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/charts/filters',
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
     * time_chart <POST>
     * @param requestBody
     * @returns Histogram_3ff3b0d OK
     * @throws ApiError
     */
    public static postApiChartsTime(
        requestBody?: TimeChartParams_e89b783,
    ): CancelablePromise<Histogram_3ff3b0d> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/charts/time',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }

    /**
     * firmware_chart <POST>
     * @param requestBody
     * @returns Histogram_3ff3b0d OK
     * @throws ApiError
     */
    public static postApiChartsFirmware(
        requestBody?: FirmwareChartParams_481408c,
    ): CancelablePromise<Histogram_3ff3b0d> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/charts/firmware',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }

}
