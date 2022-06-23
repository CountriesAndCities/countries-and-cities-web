import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { Country } from '../country-page/CountryStore'
import { ProcessStatus } from '../../utils'



export class CityStore {
  id = ''
  city: City | null = null
  countriesList: Country[] = []
  cityFetchingStatus: ProcessStatus = ProcessStatus.idle
  cityCreationStatus: ProcessStatus = ProcessStatus.idle
  cityEditingStatus: ProcessStatus = ProcessStatus.idle
  cityDeletingStatus: ProcessStatus = ProcessStatus.idle
  fetchCityError: any = null
  postCityError: any = null

  constructor() { makeAutoObservable(this)}

  createCity(formData: CreateCitySchema) {
    this.cityEditingStatus = ProcessStatus.progress

    const fData = new FormData();
    fData.append('countryId', formData.countryId)
    fData.append('name', formData.name)
    fData.append('population', formData.population.toString())
    fData.append('image', (formData.imageId as string));

    axios
      .post<City>(`${process.env.REACT_APP_API_ROOT}/cities`, fData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(d => this.onCityCreated(d.data))
      .catch(this.onCityGetError)
  }

  updateCity(formData: CreateCitySchema) {
    this.cityEditingStatus = ProcessStatus.progress

    axios
      .put<City>(`${process.env.REACT_APP_API_ROOT}/cities/${this.id}`, { ...this.city, ...formData })
      .then(d => this.onCityUpdated(d.data))
      .catch(this.onCityGetError)
  }

  fetchCity(id?: string) {
    if (!id || this.id === id) return

    this.clearCityData()
    this.id = id
    this.fetchCityError = null
    this.cityFetchingStatus = ProcessStatus.progress

    axios
      .get<City>(`${process.env.REACT_APP_API_ROOT}/cities/${this.id}`)
      .then(d => this.onCityFetchSuccess(d.data))
      .catch(this.onCityGetError)
  }

  deleteCity() {
    this.cityDeletingStatus = ProcessStatus.progress

    axios
      .delete<City>(`${process.env.REACT_APP_API_ROOT}/cities/${this.id}`)
      .then(d => this.onCityDeleteSuccess())
      .catch(this.onCityGetError)
  }

  onCityFetchSuccess = (data: City) => {
    this.city = data
    this.cityFetchingStatus = ProcessStatus.success
  }

  clearCityData() {
    this.city = null
    this.id = ''
    this.cityFetchingStatus = ProcessStatus.idle
    this.resetCityCreationStatus()
    this.resetCityEditingStatus()
  }

  onCityCreated = (d: any) => {
    this.cityCreationStatus = ProcessStatus.success
  }

  onCityUpdated = (d: City) => {
    this.city = d
    this.cityEditingStatus = ProcessStatus.success
  }

  onCityDeleteSuccess() {
    this.clearCityData()
    this.cityDeletingStatus = ProcessStatus.success
  }

  onCityGetError = (e: any) => {
    this.fetchCityError = e
  }

  resetCityCreationStatus() {
    this.cityCreationStatus = ProcessStatus.idle
  }

  resetCityEditingStatus() {
    this.cityEditingStatus = ProcessStatus.idle
  }

  resetCityDeletingStatus() {
    this.cityDeletingStatus = ProcessStatus.idle
  }
}

export type CreateCitySchema = {
  countryId: string
  name: string
  population: number
  imageId?: string
}

export type City = CreateCitySchema & {
  id?: string,
}
