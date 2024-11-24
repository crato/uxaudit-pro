import { handleAuth, HandlerError } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'


import { handleAuth, handleLogin } from '@auth0/nextjs-auth0'
import { NextRequest } from 'next/server'

export const GET = handleAuth({
  login: async (req: NextRequest) => {
    await handleLogin(req, {
      returnTo: req.nextUrl.searchParams.get('returnTo') || '/dashboard',
      authorizationParams: {
        prompt: 'login', // Force login screen
      },
    })
  },
})




/*export const GET = handleAuth({
  async callback(req, ctx) {
    try {
      const res = await handleAuth()(req, ctx)
      return res
    } catch (error) {
      if (error instanceof HandlerError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status || 500 }
        )
      }
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  },
  async login(req, ctx) {
    try {
      const res = await handleAuth()(req, ctx)
      return res
    } catch (error) {
      if (error instanceof HandlerError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status || 500 }
        )
      }
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  },
  async logout(req, ctx) {
    try {
      const res = await handleAuth()(req, ctx)
      return res
    } catch (error) {
      if (error instanceof HandlerError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status || 500 }
        )
      }
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  }
})*/

