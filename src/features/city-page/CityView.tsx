import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Col, Row, Spin } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { links } from '../../App'
import { BtnBackToPrevPage } from '../../components/BtnBackToPrevPage'
import { Heading } from '../../components/Heading'
import { CityImg } from '../../components/CityImg'
import { Wrapper } from '../../components/Wrapper'
import { CityStore } from './CityStore'

export const CityView = () => {
  const store = new CityStore()
  return <Component store={store} />
}

export const Component = observer(({ store }: { store: CityStore }) => {
  const { id, countryId } = useParams<'id' | 'countryId'>()

  useEffect(() => {
    id && store.fetchCity(id)
  }, [id])

  const { city } = store
  if (!city && store.cityFetchingStatus !== 'progress') return <p>No such city</p>

  if (!city) return <Wrapper><Row justify="center"><Spin /></Row></Wrapper>

  return <Wrapper>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle">
      <Col span={24}>
        <BtnBackToPrevPage text="Back to cities list" />
      </Col>

      <Col flex="none">
        <Heading>{city.name}</Heading>
      </Col>

      <Col flex="none">
        <Link to={`${links.countryView}/${countryId}${links.cityEdit}/${city.id}`}><EditOutlined /></Link>
      </Col>
    </Row>

    <Row><SubHeader>Population: {city.population}</SubHeader></Row>

    <Row>
      <Col>
        <CityImg id={city.id} name={city.name} imageId={store.city?.imageId} />
      </Col>
    </Row>
  </Wrapper>
})

const SubHeader = styled.p`
  color: #727272
`
