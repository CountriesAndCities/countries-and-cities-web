import React from 'react'
import { Image } from 'antd'
import { Wrapper } from './Wrapper'

export function SomethingWentWrong() {
  return <Wrapper>
    <Image src={process.env.PUBLIC_URL + '/armageddon-isparta.gif'} alt="explosion" />
    Something went wrong
  </Wrapper>
}
