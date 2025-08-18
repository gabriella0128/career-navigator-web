export const retryStrategy = {
    maxAttempts: 1,
    statusCodes: [401],
    shouldRetry: (attempt: number, status: number) => {
        return attempt < retryStrategy.maxAttempts &&
            retryStrategy.statusCodes.includes(status)
    }
}