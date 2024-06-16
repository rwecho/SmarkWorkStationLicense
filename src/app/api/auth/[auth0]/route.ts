import { handleAuth, handleLogout } from '@auth0/nextjs-auth0'
import {} from '@auth0/nextjs-auth0'
export const GET = handleAuth({
  logout: handleLogout((req) => {
    return { returnTo: '/' }
  }),
})
