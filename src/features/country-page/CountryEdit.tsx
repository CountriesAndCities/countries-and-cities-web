import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Button, Col, Divider, Form, Input, message, Row, Spin } from 'antd'
import { CountryStore } from './CountryStore'
import { useFetchCountry } from '../countries-list/utils'
import { validateMessages } from './utils'
import { Heading } from '../../components/Heading'
import { BtnBackToPrevPage } from '../../components/BtnBackToPrevPage'
import { Wrapper } from '../../components/Wrapper'
import { ProcessStatus } from '../../utils'

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

enum modes {
  edit = 'edit',
  create = 'create'
}

// keeping store initialization here does a trick for "view => edit" switch for same country
const store = new CountryStore()
export const CountryEdit = () => <Component store={store} />

export const Component = observer(({ store }: { store: CountryStore }) => {
  const countryId = useFetchCountry(store)
  const [mode, setMode] = useState(modes.edit)

  const { country } = store

  useEffect(() => autorun(() => {setMode(countryId ? modes.edit : modes.create)}), [])

  useEffect(() => {!countryId && store.clearCountryData()}, [countryId, store])

  useMessageOnEdit()
  useMessageOnCreation()

  const isEditMode = mode === 'edit'

  const initialValues = {
    name: country?.name,
    shortCode: country?.shortCode
  }

  const isLoading = store.countryEditingStatus === 'progress' || store.countryCreationStatus === 'progress'
  return <Wrapper>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle">
      <Col span={24}>
        <BtnBackToPrevPage />
      </Col>

      <Col flex="auto">
        <Heading>{isEditMode ? 'Edit' : 'Create'} country</Heading>
      </Col>
    </Row>

    <Divider />

    <Row>
      <Col span={24}>
        {isEditMode && !country?.name
          ? <Spin />
          : <Form
            {...layout}
            key={mode}
            initialValues={initialValues}
            name="country"
            onFinish={values => isEditMode && country?.id ? store.updateCountry(values) : store.createCountry(values)}
            validateMessages={validateMessages}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true, min: 3 }]}>
              <Input />
            </Form.Item>

            <Form.Item name="shortCode" label="short code" rules={[{ required: true, min: 3 }]}>
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
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
    switch (store.countryEditingStatus) {
      case ProcessStatus.success:
        message.success({ content: 'Updated' })
        store.resetCountryEditingStatus()
        window.history.back()
        break
      case ProcessStatus.error:
        message.error({ content: 'An error has happened\n' + store.postCountryError })
        break
    }
  }), [])
}

function useMessageOnCreation() {
  const navigate = useNavigate()

  useEffect(() => autorun(() => {
    switch (store.countryCreationStatus) {
      case ProcessStatus.success:
        message.success({ content: 'Created' })
        store.resetCountryCreationStatus()
        navigate('/')
        break
      case ProcessStatus.error:
        message.error({ content: 'An error has happened\n' + store.postCountryError })
        break
    }
  }), [])
}
