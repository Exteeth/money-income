import React from 'react';
import AppShell from '../components/Layout/AppShell';
import TransactionForm from '../components/Transaction/TransactionForm';

export const AddPage: React.FC = () => {
  return (
    <AppShell>
      <TransactionForm />
    </AppShell>
  );
};

export default AddPage;
