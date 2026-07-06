import {defineConfig} from "vitest/config"

export default defineConfig({
    test: {
        server: {
            deps: {
                inline: ["attio"],
            },
        },
        alias: {
            "attio/server": new URL("./src/__mocks__/attio-server.ts", import.meta.url).pathname,
            "attio/client": new URL("./src/__mocks__/attio-client.ts", import.meta.url).pathname,
        },
    },
})
