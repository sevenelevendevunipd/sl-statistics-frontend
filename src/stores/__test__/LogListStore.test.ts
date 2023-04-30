import { LogListStore, LogListStoreState } from '../LogListStore';
import { ApiError, LogFileManagementService } from '../../openapi';
import { MAX_DATE, MIN_DATE } from '../../utils';
import { reaction } from 'mobx';

describe("LogListStore", () => {
    let logListStore: LogListStore;

    beforeEach(() => {
        jest.resetAllMocks();
        logListStore = new LogListStore()
    })

    describe("updateLogList", () => {
        const getApiLogListSpy = jest.spyOn(LogFileManagementService, 'getApiLogList');
        it("updates successfully", done => {
            const logFiles = [
                {
                    file_name: "lol",
                    first_entry_timestamp: MIN_DATE.toISOString(),
                    last_entry_timestamp: MIN_DATE.toISOString(),
                    entry_count: 123,
                }
            ];
            getApiLogListSpy.mockResolvedValue({
                min_timestamp: MIN_DATE.toISOString(),
                max_timestamp: MAX_DATE.toISOString(),
                log_files: logFiles,
            });
            reaction(() => logListStore.state, (state) => {
                if (state == LogListStoreState.idle) {
                    expect(getApiLogListSpy).toBeCalled();
                    expect(logListStore.hasLogs).toBeTruthy();
                    expect(logListStore.hasError).toBeFalsy();
                    expect(logListStore.minTimestamp).toEqual(MIN_DATE)
                    expect(logListStore.maxTimestamp).toEqual(MAX_DATE)
                    expect(logListStore.logs).toHaveLength(1);
                    expect(logListStore.logs).toEqual(logFiles)
                    done();
                }
            })
            logListStore.updateLogList();
        })
        describe("handles errors", () => {
            const errorText = "sampleerrortext"
            const testError = (error: any, done: jest.DoneCallback) => {
                reaction(() => logListStore.state, (state) => {
                    if (state == LogListStoreState.retryableError) {
                        expect(getApiLogListSpy).toBeCalled();
                        expect(logListStore.hasError).toBeTruthy();
                        expect(logListStore.errorCanRetry).toBeTruthy();
                        expect(logListStore.error).toBeDefined();
                        expect(logListStore.error).toContain(errorText)
                        done();
                    }
                })
                getApiLogListSpy.mockRejectedValueOnce(error);
                logListStore.updateLogList();
            }
            it("handles ApiErrors", done => {
                const error = new ApiError({
                    method: "PUT",
                    url: "",
                }, {
                    url: "",
                    ok: false,
                    status: 400,
                    statusText: "Bad Request",
                    body: {
                        errors: [
                            errorText
                        ]
                    }
                }, "")
                testError(error, done)
            })
            it("handles TypeErrors", done => {
                const error = new TypeError(errorText);
                testError(error, done);
            })
            it("handles other errors", done => {
                const error = new Error(errorText);
                testError(error, done);
            })
        })
    })
})