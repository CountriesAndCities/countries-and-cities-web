import { useState } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Button, Card, Col, List, Radio, Row } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { links } from '../../App'
import { City as TCity } from '../city-page/CityStore'
import { useFetchCountryOrRedirect } from '../countries-list/utils'
import { Heading } from '../../components/Heading'
import { BtnBackToPrevPage } from '../../components/BtnBackToPrevPage'
import { CityImg } from '../../components/CityImg'
import { Wrapper } from '../../components/Wrapper'
import { CountryStore } from './CountryStore'

export const CountryView = () => {
  const store = new CountryStore()
  return <Component store={store} />
}

export const Component = observer(({ store }: { store: CountryStore }) => {
  useFetchCountryOrRedirect(store)

  return <Wrapper>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle">
      <Col span={24}>
        <BtnBackToPrevPage to="/" />
      </Col>

      <Col flex="none">
        <Heading>{store.country?.name}</Heading>
      </Col>

      <Col flex="none">
        <Link to={`${links.countryEdit}/${store.country?.id}`}><EditOutlined /></Link>
      </Col>
    </Row>

    <Row>
      <Col span={24}>
        <Cities cities={store.country?.cities} countryId={store.country?.id} />
      </Col>
    </Row>
  </Wrapper>
})

type ViewingMode = 'list' | 'cards'
const Cities = observer(({ cities, countryId }: { cities?: TCity[], countryId?: string }) => {
  const [mode, setMode] = useState<ViewingMode>('cards')

  const toggleMode = () => setMode(mode === 'list' ? 'cards' : 'list')

  return <>
    <Row justify="space-between" align="middle">
      <Col>List view mode:</Col>
      <Col>
        <Radio.Group
          options={[{ label: 'List', value: 'list' }, { label: 'Cards', value: 'cards' }]}
          onChange={toggleMode}
          value={mode}
          optionType="button"
        />
      </Col>
    </Row>

    <Row justify="end">
      <AddNewCityCta><Link to={`${links.countryView}/${countryId}${links.cityCreate}`}>Add new city</Link></AddNewCityCta>
    </Row>

    <br />

    <ListStyled
      loading={!cities}
      dataSource={cities}
      grid={{ gutter: isListView(mode) ? 0 : 8, ...isListView(mode) ? { column: 1 } : { xs: 2, sm: 3, md: 3, lg: 4, xl: 4, xxl: 4 } }}
      // @ts-ignore
      renderItem={(city: TCity) => <List.Item style={{ marginBottom: '0'}}><City countryId={countryId!} city={city} mode={mode} /></List.Item>}
    />
  </>
})

const AddNewCityCta = styled(Button)`
  margin-top: 1rem;
  background: #98dec0;
  border-color: #6abd9a;

  &:hover {
    background: #afdec9;
    border-color: #8cb69a;
    color: inherit;
  }
`

const ListStyled = styled(List)`
  .ant-row {
    align-items: stretch;
    row-gap: 10px !important;

    .ant-col {
      height: 100%;

      .ant-list-item {
        height: 100%;
        
        [mode="cards"] {
          height: 100%;
          
          a { height: 100% }
          .ant-card { height: 100% }
        }
      }
    }
  }
`

const City = observer(({ countryId, city, mode }: { countryId: string, mode: ViewingMode, city?: TCity }) => {
  const { name, population, imageId, id } = city ?? {}

  return <CityListItem mode={mode}>
    <Link to={`${links.countryView}/${countryId}${links.cityView}/${id}`} style={{ display: 'block' }}>
      {isListView(mode) && <Row align="middle">
        <Col span={6} style={{ width: '100%', textAlign: 'center', lineHeight: 1 }}>
          <CityImg useMinImg id={id!} name={name!} imageId={imageId} />
        </Col>

        <Col span={17} offset={1} className="description">
          {name} with population of {population}
        </Col>
      </Row>}

      {isCardsView(mode) && <Card bodyStyle={{ alignContent: 'center' }} hoverable>
        <CityImg useMinImg id={id!} name={name!} imageId={imageId} />
        <Card.Meta title={name} description={`with population of ${population}`} />
      </Card>}
    </Link>
  </CityListItem>
})

const CityListItem = styled.div<{ mode: ViewingMode }>`
  ${(props) => props.mode === 'list' && `
    border: 1px solid #f5f5f5;
    .description { padding: 1rem 1rem 1rem 0 }
  `}
`

const isListView = (mode: ViewingMode) => mode === 'list'
const isCardsView = (mode: ViewingMode) => mode === 'cards'
