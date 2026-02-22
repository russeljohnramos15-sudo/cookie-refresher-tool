import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { cookie } = await request.json();

    if (!cookie || typeof cookie !== 'string') {
      return NextResponse.json({ error: 'Invalid cookie provided' }, { status: 400 });
    }

    // Step 1: Validate cookie and get authenticated user info
    const userRes = await fetch('https://users.roblox.com/v1/users/authenticated', {
      headers: {
        Cookie: `.ROBLOSECURITY=${cookie}`,
      },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: 'Invalid or expired cookie' }, { status: 401 });
    }

    const userData = await userRes.json();
    const userId = userData.id;

    // Step 2: Fetch additional user details in parallel
    const [
      thumbnailRes,
      currencyRes,
      groupsRes,
    ] = await Promise.allSettled([
      fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`),
      fetch('https://economy.roblox.com/v1/user/currency', {
        headers: { Cookie: `.ROBLOSECURITY=${cookie}` },
      }),
      fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`),
    ]);

    let avatarUrl = '';
    if (thumbnailRes.status === 'fulfilled' && thumbnailRes.value.ok) {
      const thumbnailData = await thumbnailRes.value.json();
      avatarUrl = thumbnailData?.data?.[0]?.imageUrl || '';
    }

    let robux = 0;
    if (currencyRes.status === 'fulfilled' && currencyRes.value.ok) {
      const currencyData = await currencyRes.value.json();
      robux = currencyData?.robux || 0;
    }

    let groupsOwned = 0;
    if (groupsRes.status === 'fulfilled' && groupsRes.value.ok) {
      const groupsData = await groupsRes.value.json();
      groupsOwned = groupsData?.data?.length || 0;
    }

    // Step 3: Try to refresh the cookie (get a new one)
    let newCookie = cookie;
    try {
      // Get CSRF token first
      const csrfRes = await fetch('https://auth.roblox.com/v2/logout', {
        method: 'POST',
        headers: {
          Cookie: `.ROBLOSECURITY=${cookie}`,
        },
      });
      const csrfToken = csrfRes.headers.get('x-csrf-token') || '';

      // Attempt cookie refresh
      const refreshRes = await fetch('https://auth.roblox.com/v1/authentication-ticket', {
        method: 'POST',
        headers: {
          Cookie: `.ROBLOSECURITY=${cookie}`,
          'x-csrf-token': csrfToken,
          'Referer': 'https://www.roblox.com',
        },
      });

      const authTicket = refreshRes.headers.get('rbx-authentication-ticket');

      if (authTicket) {
        const redeemRes = await fetch('https://auth.roblox.com/v1/authentication-ticket/redeem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'RBXAuthenticationNegotiation': '1',
          },
          body: JSON.stringify({ authenticationTicket: authTicket }),
        });

        const setCookieHeader = redeemRes.headers.get('set-cookie');
        if (setCookieHeader) {
          const match = setCookieHeader.match(/\.ROBLOSECURITY=([^;]+)/);
          if (match) {
            newCookie = match[1];
          }
        }
      }
    } catch {
      // Cookie refresh failed, return original cookie with user info
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: userData.name,
        displayName: userData.displayName,
        avatarUrl,
        robux,
        pendingRobux: 0,
        summary: 0,
        rap: 0,
        credit: 0,
        groupsOwned,
      },
      newCookie,
      cookieRefreshed: newCookie !== cookie,
    });
  } catch (error) {
    console.error('Refresh cookie error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
