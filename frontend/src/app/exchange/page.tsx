'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const RATE = 0.92; // 1 USD = 0.92 EUR

export default function Exchange() {
  const { register, handleSubmit, watch } = useForm();
  const from = watch('from');
  const amount = watch('amount');
  const converted = from === 'USD' ? (amount * RATE).toFixed(2) : (amount / RATE).toFixed(2);

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Exchange</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select {...register('from')} className="w-full p-3 border rounded">
          <option value="USD">USD → EUR</option>
          <option value="EUR">EUR → USD</option>
        </select>
        <input {...register('amount', { valueAsNumber: true })} type="number" step="0.01" placeholder="Amount" className="w-full p-3 border rounded" />
        <p className="text-sm text-gray-600">
          You will receive: {converted} {from === 'USD' ? 'EUR' : 'USD'}
        </p>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
          Exchange
        </button>
      </form>
    </div>
  );
}