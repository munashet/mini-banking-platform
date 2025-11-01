import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getSession() {
  try {
    const cookieStore = await cookies(); // ← Must be awaited
    const token = cookieStore.get('next-auth.session-token')?.value;

    if (!token || !process.env.NEXTAUTH_SECRET) return null;

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    return {
      user: {
        id: payload.sub as string,
        name: (payload.name as string) || null,
        email: (payload.email as string) || null,
      },
      accessToken: payload.accessToken as string,
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export default async function Dashboard() {
  const session = await getSession();

  if (!session?.accessToken) {
    redirect('/login');
  }

  // Reuse cookies for fetch
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('next-auth.session-token')?.value || '';

  const [accountsRes, txRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Cookie: `next-auth.session-token=${tokenCookie}`,
      },
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions?page=1&limit=5`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Cookie: `next-auth.session-token=${tokenCookie}`,
      },
      cache: 'no-store',
    }),
  ]);

  const accounts = await accountsRes.json();
  const { data: recentTx = [] } = await txRes.json();

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        <form action="/api/auth/signout" method="post">
          <button className="text-red-600 hover:underline">Logout</button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {accounts.map((acc: any) => (
          <div key={acc.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900">{acc.currency} Wallet</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {acc.currency === 'USD' ? '$' : '€'}
              {parseFloat(acc.balance).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/transfer" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Transfer
        </Link>
        <Link href="/exchange" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
          Exchange
        </Link>
        <Link href="/history" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
          History
        </Link>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTx.length > 0 ? (
                recentTx.map((tx: any) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{tx.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.metadata?.currency} {tx.metadata?.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}