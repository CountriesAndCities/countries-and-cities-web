import React, { useState } from 'react'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

export type UploadPicturesProps = {
  cityId?: string
  pics?: { name: string, url: string, uid: string, status: string }[]
  onChange?: (p: any) => void
  uploadPic: boolean
}

export function UploadPictures({ cityId = '', pics = [], onChange = (uploadedFile: any) => {}, uploadPic }: UploadPicturesProps) {
  const [uploadedPictures, setUploadedPictures] = useState<any[]>(pics)

  const uploadPhotoProps = {
    action: `${process.env.REACT_APP_API_ROOT}/cities/${cityId ? cityId + '/' : ''}image`,
    name: 'image',
    fileList: uploadedPictures,
    multiple: false,
    onChange: (info: any) => {
      let fileList = [...info.fileList]

      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.url
        }
        return file
      })
      setUploadedPictures(fileList)
      onChange(info.file as any)
    },
    onDeleted(suspenseInstance: Comment) {
      onChange(suspenseInstance)
    },
    progress: {
      showInfo: true,
      format: (percent = 0) => `${parseFloat(percent.toFixed(0))}%`
    }
  }

  if (!uploadPic) {
    // @ts-ignore
    uploadPhotoProps.beforeUpload = () => false
  }

  return (
    <Upload {...uploadPhotoProps} listType="picture">
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  )
}
