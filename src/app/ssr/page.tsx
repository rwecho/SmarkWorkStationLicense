import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'

export default withPageAuthRequired(
  async function SSRPage() {
    const { user } = (await getSession()) || {}
    return (
      <>
        <p>
          You can protect a server-side rendered page by wrapping it with{' '}
          <code>withPageAuthRequired</code>. Only logged in users will be able
          to access it. If the user is logged out, they will be redirected to
          the login page instead.{' '}
        </p>
        <p>{JSON.stringify(user, null, 2)}</p>
      </>
    )
  },
  {
    returnTo: '/ssr',
  }
)
