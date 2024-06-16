'use client'
import React from 'react'
import Image from 'next/image'
import { Layout, Menu, Space, theme } from 'antd'
import { useRouter } from 'next/navigation'
import { Dropdown } from 'antd'
import { Avatar } from 'antd'
import { getSession } from '@auth0/nextjs-auth0'
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client'
import { DownOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout

const items = [
  {
    key: '1',
    label: '注册码管理',
    router: '/',
  },
]
const NavBar = () => {
  const { user, isLoading } = useUser()
  const router = useRouter()

  return (
    <div className='bg-white flex w-full items-center'>
      <div className='mx-2'>
        <Image src='/logo.png' alt='logo' width={32} height={32} />
      </div>

      <Menu
        theme='light'
        mode='horizontal'
        defaultSelectedKeys={['2']}
        items={items}
        onClick={({ key }) => {
          const item = items.find((item) => item.key === key)
          if (item) {
            router.push(item.router)
          }
        }}
        style={{ flex: 1, minWidth: 0 }}
      />

      <div className='ms-auto me-4'>
        <a
          onClick={(e) => {
            e.preventDefault()
            router.push('/api/auth/logout')
          }}
        >
          {user?.picture && (
            <Image
              src={user.picture}
              alt='avatar'
              width={32}
              height={32}
              className='rounded-full'
            ></Image>
          )}
        </a>
      </div>
    </div>
  )
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  return (
    <UserProvider>
      <Layout className='h-full'>
        <Header
          style={{
            backgroundColor: 'transparent',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <NavBar></NavBar>
        </Header>
        <Content style={{ padding: '0 48px' }}>
          <div
            className='mt-4'
            style={{
              padding: 24,
              minHeight: 380,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Sws License ©{new Date().getFullYear()} Created by rwecho
        </Footer>
      </Layout>
    </UserProvider>
  )
}

export default MainLayout
