import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { City } from '../city-page/CityStore'
import { ProcessStatus } from '../../utils'

export class CountryStore {
  id: string | undefined
  country: Country | null = null
  countryCreationStatus: ProcessStatus = ProcessStatus.idle
  countryEditingStatus: ProcessStatus = ProcessStatus.idle
  fetchCountryError: any = null
  postCountryError: any = null

  constructor() { makeAutoObservable(this) }

  createCountry(formData: CreateCountrySchema) {
    this.countryCreationStatus = ProcessStatus.progress

    axios
      .post(`${process.env.REACT_APP_API_ROOT}/countries`, formData)
      .then(d => this.onCountryCreated(d))
      .catch(this.onCreateCountryError)
  }

  updateCountry(formData: UpdateCountrySchema) {
    this.countryEditingStatus = ProcessStatus.progress
    this.postCountryError = null

    axios
      .put<Country>(`${process.env.REACT_APP_API_ROOT}/countries/${this.id}`, formData)
      .then(d => this.onCountryUpdated(d.data))
      .catch(this.onCreateCountryError)
  }

  fetchCountry(id: string) {
    if (!id || id === this.id) return

    this.clearCountryData()
    this.id = id
    this.fetchCountryError = null

    axios
      .get(`${process.env.REACT_APP_API_ROOT}/countries/${this.id}`)
      .then(d => this.setCountryData(d.data))
      .catch(this.onGetCountryDataError)
  }

  setCountryData = (data: Country) => {
    this.country = data
  }

  clearCountryData() {
    this.country = null
    this.id = ''
  }

  onCountryCreated = (d: any) => {
    this.countryCreationStatus = ProcessStatus.success
  }

  onCountryUpdated = (d: Country) => {
    this.country = d
    this.countryEditingStatus = ProcessStatus.success
  }

  onGetCountryDataError = (e: any) => {
    this.fetchCountryError = e
  }

  onCreateCountryError = (e: any) => {
    this.countryCreationStatus = ProcessStatus.error
    this.postCountryError = e
  }

  onUpdateCountryError = (e: any) => {
    this.countryEditingStatus = ProcessStatus.error
    this.postCountryError = e
  }

  resetCountryCreationStatus() {
    this.countryCreationStatus = ProcessStatus.idle
  }

  resetCountryEditingStatus() {
    this.countryEditingStatus = ProcessStatus.idle
  }
}

export type CreateCountrySchema = {
  name: string,
  shortCode: string,
}

export type UpdateCountrySchema = CreateCountrySchema & {
  cities: string,
  pictures?: any[]
}

export type Country = {
  name: string,
  shortCode: string,
  cities: City[]
  id?: string,
}
