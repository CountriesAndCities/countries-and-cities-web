import React, { useEffect, useState } from 'react'
import { Image } from 'antd'
import { autorun, observable } from 'mobx'
import styled from 'styled-components'

type Props = { name: string, useMinImg?: boolean, imageId?: string | null, id?: string }

const noImageSrc = process.env.PUBLIC_URL + '/no-image.svg'

export function CityImg({ id, name, imageId, useMinImg = false }: Props) {
  const [image, setImage] = useState(process.env.PUBLIC_URL + '/img-loading-placeholder.gif')
  let tries = observable({ count: 0, increase() { this.count++ } })
  const maxTries = 10

  const fetchImage = () => {
    tries.increase()
    return fetch(`${process.env.REACT_APP_API_ROOT}/cities/${id}/image${useMinImg ? '/min' : ''}`)
      .then(async r => {
        const isSuccess = r.status === 200
        return { success: isSuccess, img: isSuccess ? await r.blob() : '' }
      })
      .then(r => {
        r.success && setImage(URL.createObjectURL(r.img as Blob))
        tries.count >= maxTries && setImage(noImageSrc)
        return r.success
      })
  }

  const retry = () => tries.count < maxTries && setTimeout(fetchImage, 2000)

  useEffect(() => {
    imageId && fetchImage().then(isOk => {!isOk && retry()})
    return autorun(() => tries.count > 1 && retry())
  }, [])

  return imageId ? <Image
    src={image}
    preview={false}
    alt={`${name} picture`}
    fallback={process.env.PUBLIC_URL + '/img-loading-placeholder.gif'}
  /> : <NoImage src={noImageSrc} isMiniature={useMinImg} preview={false} alt="no image" />
}

const NoImage = styled(Image)<{ isMiniature: boolean }>`
  max-height: ${props => props.isMiniature ? 8 : 15}vw;
`
