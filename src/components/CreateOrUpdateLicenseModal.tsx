import { License } from '@/types/license'
import { InfoCircleOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  notification,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { IoFingerPrint, IoInformation } from 'react-icons/io5'

type CreateOrUpdateLicenseModalProps = {
  isOpen: boolean
  onClose: (license?: License) => void
  license?: License
}

const SubmitButton = ({
  form,
  children,
}: {
  form: any
  children: React.ReactNode
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false)
  const values = Form.useWatch([], form)
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(true)
      })
      .catch(() => {
        setSubmittable(false)
      })
  }, [form, values])

  return (
    <Button type='primary' htmlType='submit' disabled={!submittable}>
      {children}
    </Button>
  )
}

const GenerateButton = ({
  form,
  children,
  onGenerate,
}: {
  form: any
  children: React.ReactNode
  onGenerate?: () => Promise<void>
}) => {
  const [generatable, setGeneratable] = useState<boolean>(false)
  const fingerprint = Form.useWatch('fingerprint', form)

  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    if (fingerprint) {
      setGeneratable(true)
    } else {
      setGeneratable(false)
    }
  }, [form, fingerprint])
  const handleGenerate = async () => {
    try {
      setLoading(true)
      if (onGenerate) {
        await onGenerate()
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }
  return (
    <Button
      type='primary'
      htmlType='submit'
      onClick={handleGenerate}
      disabled={!generatable}
      loading={loading}
    >
      {children}
    </Button>
  )
}

const CreateOrUpdateLicenseModal = (props: CreateOrUpdateLicenseModalProps) => {
  const [form] = Form.useForm<License>()
  const [notice, contextHolder] = notification.useNotification()

  const initialValues = props.license || {
    fingerprint: '',
    brand: '',
    expireDays: 31,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const handleGenerating = async () => {
    try {
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.getFieldsValue()),
      })

      if (response.ok) {
        const license = await response.json()
        notice['success']({
          message: '注册码生成成功',
          description: '注册码生成成功',
          placement: 'top',
        })
        props.onClose(license)
      } else {
        notice['error']({
          message: '注册码生成失败',
          description: '注册码生成失败',
          placement: 'top',
        })
      }
    } catch (error: any) {
      notice['error']({
        message: '注册码生成失败',
        description: error.message || '注册码生成失败',
        placement: 'top',
      })
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        title='增加注册码'
        open={props.isOpen}
        onOk={() => props.onClose()}
        onCancel={() => props.onClose()}
        okText='确认'
        cancelText='取消'
        footer={
          <Space>
            <Button onClick={() => props.onClose()}>取消</Button>
            <GenerateButton form={form} onGenerate={handleGenerating}>
              生成注册码
            </GenerateButton>
          </Space>
        }
      >
        <Form
          initialValues={initialValues}
          form={form}
          name='basic'
          layout='vertical'
          labelCol={{ span: 8 }}
          labelWrap={true}
        >
          <Form.Item
            label='指纹'
            rules={[{ required: true, message: '请输入电脑指纹!' }]}
            name='fingerprint'
            tooltip='This is a required field'
          >
            <Input addonAfter={<IoFingerPrint />} placeholder='指纹' />
          </Form.Item>
          <Form.Item
            label='过期时间'
            name='expireDays'
            tooltip={{
              title: 'Tooltip with customize icon',
              icon: <InfoCircleOutlined />,
            }}
          >
            <InputNumber
              className='w-full'
              min={1}
              addonBefore='有效期:'
              addonAfter='天'
            ></InputNumber>
          </Form.Item>
          <Form.Item label='品牌' name='brand'>
            <Input addonAfter={<IoInformation />} placeholder='激活电脑信息' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CreateOrUpdateLicenseModal
