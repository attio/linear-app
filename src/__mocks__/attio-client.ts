import type {AsyncCacheConfig} from "attio/client"

export function useAsyncCache<Config extends AsyncCacheConfig>(_config: Config): never {
    throw new Error("useAsyncCache must be mocked in tests")
}
