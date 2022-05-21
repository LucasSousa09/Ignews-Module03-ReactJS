import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
    return {
        useRouter(){
            return {
                asPath:'/'
            }
        }
    }
})

describe('ActiveLink component',() =>{
    it('renders correctly',() => {
        render(
             <ActiveLink href="/" activeClassName="active">
                 <a>Home</a>
             </ActiveLink>
         )
     
         expect(screen.getByText('Home')).toBeInTheDocument()
     })
     
     test('is receiving ative class when asPath is equal to the href', () => {
         render(
              <ActiveLink href="/" activeClassName="active">
                  <a>Home</a>
              </ActiveLink>
          )
      
          expect(screen.getByText('Home')).toHaveClass('active')
      })
})

