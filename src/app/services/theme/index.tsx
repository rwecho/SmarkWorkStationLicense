'use client'
import React from 'react'
import { ConfigProvider } from 'antd'

const WithTheme = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#52c41a',
          borderRadius: 8,
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {},
        }}
      >
        {children}
      </ConfigProvider>
    </ConfigProvider>
  )
}

export default WithTheme
