import { render,screen } from "@testing-library/react";
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { mocked } from 'jest-mock'
import { useSession } from "next-auth/react";
import { getPrismicClient } from '../../services/prismic'
import { useRouter } from "next/router";

const post = {
        slug: 'the-best-post',
        title: 'The Best Post',
        content: '<p>Post paragraph</p>',
        updatedAt: '19 de Maio 2022'
    }

    jest.mock('next-auth/react')
    jest.mock('next/router')
    jest.mock('../../services/prismic')

describe('PostPreview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'})

        render(<PostPreview post={post}/>)

        expect(screen.getByText('The Best Post')).toBeInTheDocument()
        expect(screen.getByText('Post paragraph')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
        
    })

    it('redirects to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({ data: {
            activeSubscription:'fake-active-subscription',
        },
        status: 'authenticated'} as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<PostPreview post={post}/>)

        expect(pushMock).toHaveBeenCalledWith('/posts/the-best-post')
    })

    it('loads initial data', async () => {
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

        const response = await getStaticProps({ params: {slug: 'the-best-post'}} as any )

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