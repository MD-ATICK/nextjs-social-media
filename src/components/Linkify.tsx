import Link from 'next/link'
import React from 'react'
import { LinkIt, LinkItUrl } from 'react-linkify-it'
import UserLinkWithTooltip from './UserLinkWithTooltip'

interface props {
    children: React.ReactNode
}

export default function Linkify({ children }: props) {
    return (
        <LinkifyUsername >
            <LinkifyHashtag>
                <LinkifyUrl>
                    {children}
                </LinkifyUrl>
            </LinkifyHashtag>
        </LinkifyUsername>
    )
}


function LinkifyUrl({ children }: props) {
    return <LinkItUrl className=' text-primary hover:underline'>
        {children}
    </LinkItUrl>
}


function LinkifyUsername({ children }: props) {
    return <LinkIt
        regex={/(@[a-zA-Z0-9_-]+)/}
        component={(match, key) => (
            <UserLinkWithTooltip key={key} username={match.slice(1)} >
                {match}
            </UserLinkWithTooltip>
        )}
    >
        {children}
    </LinkIt>
}


function LinkifyHashtag({ children }: props) {
    return <LinkIt
        regex={/(#[a-zA-Z0-9]+)/}
        component={(match, key) => (
            <Link key={key} href={`/hashtag/${match.slice(1)}`} className=' text-primary hover:underline'>
                {match}
            </Link>
        )}
    >
        {children}
    </LinkIt>
}