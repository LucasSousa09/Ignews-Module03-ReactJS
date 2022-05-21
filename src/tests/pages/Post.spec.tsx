import { render,screen } from "@testing-library/react";
import { mocked } from 'jest-mock'
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
        slug: 'the-best-post',
        title: 'The Best Post',
        content: '<p>Post paragraph</p>',
        updatedAt: '19 de Maio 2022'
    }

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Post page',() => {
    it('renders correctly',() => {
        render(<Post post={post}/>)

        expect(screen.getByText('The Best Post')).toBeInTheDocument()
        expect(screen.getByText('Post paragraph')).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps({ params: {slug: 'the-best-post'}} as any )

        expect(response).toEqual(
            expect.objectContaining({ 
                redirect: expect.objectContaining({
                    destination: '/posts/preview/the-best-post'
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMoked = mocked(getPrismicClient)

        getPrismicClientMoked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'The Best Post' }
                    ],
                    content: [
                        { type:'paragraph', text: 'Post content' }
                    ]
                },
                last_publication_date: '05-19-2022'
            })
        } as any )

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription',
        } as any)

        const response = await getServerSideProps({ params: {slug: 'the-best-post'}} as any )

        expect(response).toEqual(
            expect.objectContaining({ 
               props: {
                   post: {
                       slug: 'the-best-post',
                       title: 'The Best Post',
                       content: '<p>Post content</p>',
                       updatedAt: '19 de maio de 2022'
                   }
               }
            })
        )


    })
})