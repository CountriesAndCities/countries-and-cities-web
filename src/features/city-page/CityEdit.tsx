import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Button, Col, Divider, Form, Input, InputNumber, message, Row, Select, Spin } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { links } from '../../App'
import { BtnBackToPrevPage } from '../../components/BtnBackToPrevPage'
import { Heading } from '../../components/Heading'
import { validateMessages } from '../country-page/utils'
import { CountriesStore } from '../countries-list/CountriesStore'
import { ProcessStatus } from '../../utils'
import { CityStore } from './CityStore'
import { UploadPictures } from './UploadPictures'

enum modes {
  edit = 'edit',
  create = 'create'
}

// keeping store initialization here does a trick for "view => edit" switch for same city
const store = new CityStore()
const countriesStore = new CountriesStore()
export const CityEdit = () => <Component store={store} countriesStore={countriesStore} />

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

type UploadedImage = { status: 'progress' | 'done' | 'error' | 'removed', percent: number, name: string, response: { id: string, imageId: string } }
const Component = observer(({ store, countriesStore }: { store: CityStore, countriesStore: CountriesStore }) => {
  const [mode, setMode] = useState(modes.edit)
  const [uploadedPicture, setUploadedPicture] = useState<UploadedImage>()
  const { id, countryId } = useParams<'id' | 'countryId'>()
  const shouldShowCountries = !countryId

  useEffect(() => {
    id && store.fetchCity(id)
  }, [id])

  useEffect(() => autorun(() => {
    setMode(id ? modes.edit : modes.create)
    !id && store.clearCityData()
  }), [])

  useEffect(() => {
    if (shouldShowCountries) countriesStore.fetchCountries()
  }, [shouldShowCountries])

  useMessageOnEdit()
  useMessageOnCreation(countryId!)
  useMessageOnDelete(countryId!)

  const { city } = store
  const isEditMode = mode === 'edit'

  const initialValues = {
    name: city?.name,
    population: city?.population,
    imageId: city?.imageId
  }

  if (shouldShowCountries) {
    // @ts-ignore
    initialValues.countries = countriesStore.countries
  }

  const onSubmit = (values: any) => {
    let imageId: string | null | undefined = city?.imageId

    if (uploadedPicture && uploadedPicture.response) {
      imageId = uploadedPicture.response?.imageId
    }
    if (uploadedPicture && uploadedPicture.status === 'removed') {
      imageId = null
    }

    return isEditMode && city?.id
      ? store.updateCity({
        ...values,
        imageId
      })
      : store.createCity({ countryId, ...values })
  }

  const isLoading = store.cityDeletingStatus === 'progress' || store.cityEditingStatus === 'progress' || store.cityCreationStatus === 'progress'

  return <Wrapper>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle">
      <Col span={24}>
        <BtnBackToPrevPage text="Back to cities list" />
      </Col>

      <Col flex="auto">
        <Heading>{isEditMode ? 'Edit' : 'Create'} city</Heading>
      </Col>

      {isEditMode && <Col flex="none">
        <Button danger onClick={() => store.deleteCity()}><DeleteOutlined /></Button>
      </Col>}
    </Row>

    <Divider />

    <Row>
      <Col span={24}>
        {isEditMode && !city?.name
          ? <Spin />
          : <Form
            {...layout}
            key={mode}
            initialValues={initialValues}
            name="city"
            onFinish={onSubmit}
            validateMessages={validateMessages}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true, min: 3 }]}>
              <Input />
            </Form.Item>

            <Form.Item name="population" label="Population" rules={[{ required: true, min: 3, type: 'number' }]}>
              <InputNumber />
            </Form.Item>

            {shouldShowCountries && <Form.Item name="countries" label="Countries" rules={[{ required: true }]}>
              <Select>
                {countriesStore.countries.map(country => <Select.Option value={country.name}>{country.name}</Select.Option>)}
              </Select>
            </Form.Item>}

            <Form.Item label="Pictures" name="imageId">
              <UploadPictures
                cityId={city?.id}
                onChange={setUploadedPicture}
                uploadPic={isEditMode}
                {...isEditMode && city?.imageId ? {
                  pics: [{
                    name: city?.name,
                    url: `${process.env.REACT_APP_API_ROOT}/cities/${id}/image/min`,
                    uid: '-1',
                    status: 'done'
                  }]
                } : {}}
              />
              {/*<Input type="file" id="imageFile" />*/}
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
              <Button type="primary" htmlType="submit" disabled={isLoading} icon={isLoading ? <Spin /> : ''}>
                Submit
              </Button>
              <Divider type="vertical" />
              <Button type="ghost" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </Form.Item>
          </Form>}
      </Col>
    </Row>
  </Wrapper>
})

function useMessageOnEdit() {
  useEffect(() => autorun(() => {
    switch (store.cityEditingStatus) {
      case ProcessStatus.success:
        message.success({ content: 'Updated' })
        store.resetCityEditingStatus()
        window.history.back()
        break
      case ProcessStatus.error:
        message.error({ content: 'An error has happened\n' + store.postCityError })
        break
    }
  }), [])
}

function useMessageOnCreation(countryId: string) {
  const navigate = useNavigate()

  useEffect(() => autorun(() => {
    switch (store.cityCreationStatus) {
      case ProcessStatus.success:
        message.success({ content: 'Created' })
        store.resetCityCreationStatus()
        navigate(`${links.countryView}/${countryId}`)
        break
      case ProcessStatus.error:
        message.error({ content: 'An error has happened\n' + store.postCityError })
        break
    }
  }), [])
}

function useMessageOnDelete(countryId: string) {
  const navigate = useNavigate()

  useEffect(() => autorun(() => {
    switch (store.cityDeletingStatus) {
      case ProcessStatus.success:
        message.success({ content: 'Removed' })
        store.resetCityDeletingStatus()
        navigate(`${links.countryView}/${countryId}`)
        break
      case ProcessStatus.error:
        message.error({ content: 'An error has happened\n' + store.postCityError })
        break
    }
  }), [])
}

const Wrapper = styled.div`
  padding: 1rem;

  @media (min-width: 500px) {
    max-width: 70%;
    margin: 0 auto;
  }

  .ant-input-number {
    width: 100%;
  }
`

