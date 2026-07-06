function formatArgs(prefix: string, args: readonly unknown[]): unknown[] {
    if (args.length === 0) {
        return [`[${prefix}]`]
    }

    const [first, ...rest] = args

    if (typeof first === "string") {
        return [`[${prefix}] ${first}`, ...rest]
    }

    return [`[${prefix}]`, first, ...rest]
}

export type Logger = {
    log: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
}

export function createLogger(prefix: string): Logger {
    return {
        log: (...args) => {
            console.log(...formatArgs(prefix, args))
        },
        error: (...args) => {
            console.error(...formatArgs(prefix, args))
        },
    }
}
