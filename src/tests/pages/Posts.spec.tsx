import { render,screen } from "@testing-library/react";
import { mocked } from 'jest-mock'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

const posts = [
    {
        slug: 'the-best-post',
        title: 'The Best Post',
        excerpt: 'Post excerpt',
        updatedAt: '19 de Maio 2022'
    }
]

jest.mock('../../services/prismic')

describe('Posts page',() => {
    it('renders correctly',() => {
        render(<Posts posts={posts}/>)

        expect(screen.getByText('The Best Post')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'the-best-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'The Best Post' }
                            ],
                            content: [
                                { type:'paragraph', text: 'Post excerpt' }
                            ]
                        },
                        last_publication_date: '05-19-2022',
                    }
                ]
            })
        }as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({ 
                props: { 
                    posts: [
                    { 
                        slug: 'the-best-post', 
                        title: 'The Best Post',
                        excerpt: 'Post excerpt',
                        updatedAt: '19 de maio de 2022' 
                    }
                ]
                }
            })
        )
    })
})