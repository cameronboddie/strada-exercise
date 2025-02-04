import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Invoice } from '../types/models.ts';

export type AccountsReceivableAgingChartProps = {
    title: string;
    invoices: Invoice[];
};

export default function AccountsReceivableAgingChart({
  title,
  invoices,
}: AccountsReceivableAgingChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { pending: number; paid: number }> = {};

    invoices.forEach((invoice) => {
      const dueDate = new Date(invoice.due_date);
      const monthYear = dueDate.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { pending: 0, paid: 0 };
      }

      if (invoice.paid_at) {
        monthlyData[monthYear].paid += invoice.amount; // Paid amount
      } else {
        monthlyData[monthYear].pending += invoice.amount; // Unpaid amount
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()) // Ensure sorted order
      .map(([month, amounts]) => ({ month, ...amounts }));
  }, [invoices]);

  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <LineChart
        xAxis={[{ scaleType: 'point', data: chartData.map((d) => d.month) }]}
        series={[
          { data: chartData.map((d) => d.pending), label: 'Pending Payments', color: 'red' },
          { data: chartData.map((d) => d.paid), label: 'Paid Payments', color: 'green' },
        ]}
        height={300}
      />
    </>
  );
}
