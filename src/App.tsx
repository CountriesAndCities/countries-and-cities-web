import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { Countries } from './features/countries-list/Countries'
import { CountryEdit } from './features/country-page/CountryEdit'
import { CountryView } from './features/country-page/CountryView'
import { CityEdit } from './features/city-page/CityEdit'
import { CityView } from './features/city-page/CityView'

export enum links {
  countryCreate = '/country/create',
  countryEdit = '/country/edit',
  countryView = '/country/view',
  cityView = '/city/view',
  cityCreate = '/city/create',
  cityEdit = '/city/edit'
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path={`${links.countryCreate}`} element={<CountryEdit />} />
        <Route path={`${links.countryEdit}/:id`} element={<CountryEdit />} />
        <Route path={`${links.countryView}/:id`} element={<CountryView />} />

        <Route path={`${links.cityCreate}`}>
          <Route path="" element={<CityEdit />} />
          <Route path=":id" element={<CityEdit />} />
        </Route>

        <Route path={`${links.countryView}/:countryId${links.cityCreate}`} element={<CityEdit />} />
        <Route path={`${links.countryView}/:countryId${links.cityEdit}/:id`} element={<CityEdit />} />
        <Route path={`${links.countryView}/:countryId${links.cityView}/:id`} element={<CityView />} />

        <Route path="/" element={<Countries />} />
      </Routes>
    </Router>
  )
}

export default App
