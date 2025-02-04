import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import AccountsReceivableAgingChart from '../components/AccountsReceivableAgingChart.tsx';
import { useGetInvoicesQuery } from '../services/api.ts';

export default function Invoices() {
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const handleStatusChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const { data: invoices, isLoading, error } = useGetInvoicesQuery();

  // Optionally, handle loading and error states.
  if (isLoading) {
    return <Typography>Loading invoices...</Typography>;
  }
  if (error) {
    console.error(error);
    return <Typography color="error">Error loading invoices.</Typography>;
  }

  const filteredInvoices = invoices?.filter((invoice: any) => {
    if (statusFilter === 'All Statuses') {
      return true;
    }
    return invoice.status === statusFilter;
  });

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Invoice Summary
      </Typography>
      {filteredInvoices && (<AccountsReceivableAgingChart title="Aging Accounts Receivable" invoices={filteredInvoices} />)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={handleStatusChange} label="Status">
            <MenuItem value="All Statuses">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices?.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.recipient}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.due || row.due_date}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
