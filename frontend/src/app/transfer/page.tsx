'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const schema = z.object({
  toUserId: z.string().uuid(),
  currency: z.enum(['USD', 'EUR']),
  amount: z.number().positive().max(999999),
});

export default function Transfer() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Transfer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('toUserId')} placeholder="Recipient User ID" className="w-full p-3 border rounded" />
        <select {...register('currency')} className="w-full p-3 border rounded">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <input {...register('amount', { valueAsNumber: true })} type="number" step="0.01" placeholder="Amount" className="w-full p-3 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Send Transfer
        </button>
      </form>
    </div>
  );
}