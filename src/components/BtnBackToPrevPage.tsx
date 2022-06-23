import React from 'react'
import { LeftCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

type Props = { to?: string, text?: string, className?: string }

export function BtnBackToPrevPage({ to, text = 'Back to countries list', className = '' }: Props) {
  const navigate = useNavigate()
  return <BtnBack type="text" onClick={() => { to ? navigate(to) : window.history.back() }} className={className}><LeftCircleOutlined /> {text}
  </BtnBack>
}

const BtnBack = styled(Button)`
  color: inherit;
  padding: 0;
`
