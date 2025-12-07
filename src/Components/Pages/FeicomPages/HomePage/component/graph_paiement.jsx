import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', paiements: 4000, transactions: 2400 },
  { name: 'Fév', paiements: 3000, transactions: 1398 },
  { name: 'Mar', paiements: 2000, transactions: 9800 },
  { name: 'Avr', paiements: 2780, transactions: 3908 },
  { name: 'Mai', paiements: 1890, transactions: 4800 },
  { name: 'Jun', paiements: 2390, transactions: 3800 },
  { name: 'Jul', paiements: 3490, transactions: 4300 },
];

export default function Example() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="paiements" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name="DPO"
          />
          <Line 
            type="monotone" 
            dataKey="transactions" 
            stroke="#82ca9d" 
            strokeWidth={2}
            name="Realisations"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}