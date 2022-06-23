import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'

type Props = PropsWithChildren<any>

export function Wrapper({ children }: Props) {
  return <Component>
    {children}
  </Component>
}

const Component = styled.div`
  padding: 1rem;
  width: 100%;
  @media (min-width: 500px) {
    max-width: 70%;
    margin: 0 auto;
  }
`
