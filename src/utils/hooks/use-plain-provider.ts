import type {DecoratedComboboxOptionsProvider, PlainComboboxOptionsProvider} from "attio/client"
import {useCallback, useMemo} from "react"

export function usePlainProvider(
    provider: DecoratedComboboxOptionsProvider
): PlainComboboxOptionsProvider {
    const getOption = useCallback(
        async (value: string) => {
            const option = await provider.getOption(value)
            if (!option) return undefined
            return {label: option.label}
        },
        [provider]
    )

    const search = useCallback(
        async (query: string) => {
            const options = await provider.search(query)
            return options.map(({label, value, ...rest}) => ({
                label,
                value,
                ...("categoryLabel" in rest ? {categoryLabel: rest.categoryLabel} : {}),
                description:
                    "description" in rest && rest.description != null
                        ? rest.description
                        : "categoryLabel" in rest
                          ? rest.categoryLabel
                          : undefined,
            }))
        },
        [provider]
    )

    return useMemo(() => ({getOption, search}), [getOption, search])
}
