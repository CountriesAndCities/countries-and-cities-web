import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Button, Col, List, Row } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { links } from '../../App'
import { CountriesStore } from './CountriesStore'
import { Country } from '../country-page/CountryStore'

export const CountriesList = observer(({ store }: { store: CountriesStore }) => {
  return <List
    loading={!store.countries.length}
    grid={{ column: 1, gutter: 0 }}
    dataSource={store.countries}
    renderItem={country => <List.Item>
      <CountryListItem key={country.name} {...country} onDelete={store.deleteCountry.bind(store)} />
    </List.Item>} />
})

const CountryListItem = observer(({ name, cities, id, onDelete }: Country & { onDelete: (id: string) => void }) => {
  const generateDesc = () => cities.length > 0
    ? <>includes next cities: <br />{cities.map(city => `${city},`)}</>
    : ''
  return (
    <Row>
      <Col flex="auto">
        <Link to={`${links.countryView}/${id}`} key="list-loadmore-more">{name}</Link></Col>
      <Col flex="none">
        <Button danger type="text" title="Delete country" onClick={() => {
          onDelete(id!)
          return 0
        }}><DeleteOutlined /></Button>
        <Link to={`${links.countryEdit}/${id}`} key="list-loadmore-edit"><EditOutlined /></Link>
      </Col>
      <Col span={24}>{generateDesc()}</Col>
    </Row>
  )
})
