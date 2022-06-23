import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { Country } from '../country-page/CountryStore'

export class CountriesStore {
  countries: Country[] = []
  error: Record<string, any> | null = null

  constructor() {
    makeAutoObservable(this)
  }

  fetchCountries() {
    axios
      .get<Country[]>(`${process.env.REACT_APP_API_ROOT}/countries`)
      .then(d => this.setCountries(d.data))
      .catch(this.setCountriesFetchError)
  }

  deleteCountry(id: string) {
    axios
      .delete<Country[]>(`${process.env.REACT_APP_API_ROOT}/countries/${id}`)
      .then(d => this.fetchCountries())
      .catch(this.setCountriesFetchError)
  }

  setCountries = (countries: Country[]) => {
    this.countries = countries.sort((a, b) => a.name > b.name ? 1 : -1)
  }

  setCountriesFetchError = (e: any) => {
    this.error = e
  }
}
