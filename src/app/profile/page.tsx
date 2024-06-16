'use client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client'

const Profile = () => {
  const { user, isLoading } = useUser()
  return <>{user && <div>{JSON.stringify(user, null, 2)}</div>}</>
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <div>loading.</div>,
  onError: (error) => <div>{error.message}</div>,
})
