import { getSession } from '@auth0/nextjs-auth0'
import { cookies } from 'next/headers'

export async function getServerSideUser() {
  const cookieStore = cookies()
  try {
    const session = await getSession()
    return session?.user || null
  } catch (error) {
    console.error('Error getting server side user:', error)
    return null
  }
}