import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubscribeButton }from '.'

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders correctly',() => {
        const useSessionMocked = mocked(useSession)
        
        useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'})
        
        render (<SubscribeButton />)

        expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
    })

    it('redirect user to sign in when not authenticated',() => {
        const useSessionMocked = mocked(useSession)
        const signInMocked =  mocked(signIn)
        
        useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'})

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects to posts when uer already has subscriptions',() => {
        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValue({
            data: {
                user: {
                    name: 'Jonh Doe',
                    email: 'jonhdoe@hotmail.com',
                },
                activeSubscription:'fake-active-subscription',
                expires: 'fake-expires'
            },
            status: 'authenticated'
        })

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)



        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalledWith('/posts')
    })
})