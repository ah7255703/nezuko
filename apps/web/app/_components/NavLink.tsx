'use client'
import { forwardRef, ComponentProps, useCallback } from 'react'
import Link from 'next/link'
import { ReadonlyURLSearchParams, usePathname, useSearchParams, useSelectedLayoutSegments } from 'next/navigation'

interface Props extends ComponentProps<typeof Link> {
    segment?: string
    matchSearchParams?: boolean;
    href: string;
    isActive?: (({ search, pathname }: { search: ReadonlyURLSearchParams, pathname: string }) => boolean) | boolean;
    activeClassName?: string;
    inactiveClassName?: string;
}

export const NavLink = forwardRef<HTMLAnchorElement, Props>(function NavLink(
    { href, segment, matchSearchParams, isActive, activeClassName, inactiveClassName, ...rest },
    ref
) {
    const $segments = useSelectedLayoutSegments();
    const $searchParams = useSearchParams();
    const $pathname = usePathname();
    const $isActive = useCallback(
        () => {
            if (isActive && segment) {
                console.warn('NavLink: isActive and segment are mutually exclusive')
            }
            if (isActive) {
                if (typeof isActive === 'function') {
                    return isActive({ search: $searchParams, pathname: $pathname })
                }
                return isActive
            }
            if (segment) {
                return $segments.includes(segment)
            }
            const doesPathnameMatch = $pathname.replace(/\/$/, '') === href.replace(/\/$/, '')
            if (matchSearchParams) {
                return doesPathnameMatch && $searchParams.toString() === $pathname.replace(href, '')
            }
            return doesPathnameMatch
        },
        [
            $segments,
            $searchParams,
            $pathname,
            href,
            segment,
            matchSearchParams,
        ],
    )
    const active = $isActive();

    return (
        <Link href={href} data-active={active} ref={ref}
            {...rest}
            className={`${active ? activeClassName : inactiveClassName} ${rest.className ?? ''}`}
        />
    )
})