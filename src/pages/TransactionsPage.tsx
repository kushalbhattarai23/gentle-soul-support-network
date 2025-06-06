import React, { useEffect, useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { TransactionList } from '../components/transactions/TransactionList';
import { Modal } from '../components/ui/Modal';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useWalletStore } from '../store/walletStore';
import { useTransactionStore } from '../store/transactionStore';
import { Transaction, TRANSACTION_TYPES } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useSearchParams } from 'react-router-dom';

export const TransactionsPage: React.FC = () => {
  const { wallets, fetchWallets } = useWalletStore();
  const {
    transactions,
    filteredTransactions,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterTransactions,
    isLoading,
  } = useTransactionStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const showAddModal = searchParams.get('modal') === 'add';

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, [fetchWallets, fetchTransactions]);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    await addTransaction(transaction);
    setSearchParams({});
  };

  const handleEditTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.id, transaction);
      setShowEditModal(false);
      setSelectedTransaction(null);
    }
  };

  const handleDeleteTransaction = async () => {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction.id);
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const openDeleteModal = (id: string) => {
    const transaction = transactions.find(t => t.id === id) || null;
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleApplyFilters = () => {
    filterTransactions(filterType === 'All' ? undefined : filterType, startDate, endDate);
  };

  const handleResetFilters = () => {
    setFilterType('All');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    filterTransactions();
  };

  const typeOptions = [
    { value: 'All', label: 'All Types' },
    ...TRANSACTION_TYPES.map(type => ({
      value: type,
      label: type,
    })),
  ];

  const filteredBySearch = searchQuery
    ? filteredTransactions.filter(t =>
        t.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTransactions;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setSearchParams({ modal: 'add' })}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Search"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={16} />}
              />
              <Select
                label="Transaction Type"
                options={typeOptions}
                value={filterType}
                onChange={setFilterType}
              />
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="py-6">
          <TransactionList
            transactions={filteredBySearch}
            wallets={wallets}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />

          {filteredBySearch.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No transactions found.</p>
              <Button onClick={() => setSearchParams({ modal: 'add' })}>
                Add Your First Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setSearchParams({})}
        title="Add New Transaction"
      >
        <TransactionForm
          wallets={wallets}
          onSubmit={handleAddTransaction}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Transaction"
      >
        {selectedTransaction && (
          <TransactionForm
            transaction={selectedTransaction}
            wallets={wallets}
            onSubmit={handleEditTransaction}
            isLoading={isLoading}
          />
        )}
      </Modal>

      {/* Delete Transaction Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Transaction"
        size="sm"
      >
        <div className="text-center">
          <p className="mb-4">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteTransaction}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
