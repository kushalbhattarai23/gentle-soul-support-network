import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TransactionList } from '../components/transactions/TransactionList';
import { Modal } from '../components/ui/Modal';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { useWalletStore } from '../store/walletStore';
import { useTransactionStore } from '../store/transactionStore';
import { Transaction } from '../types';

export const WalletDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { wallets, fetchWallets, selectedWallet, selectWallet } = useWalletStore();
  const {
    transactions,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
  } = useTransactionStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);
  
  useEffect(() => {
    if (id && wallets.length > 0) {
      const wallet = wallets.find(w => w.id === id);
      if (wallet) {
        selectWallet(wallet);
        fetchTransactions(id);
      }
    }
  }, [id, wallets, selectWallet, fetchTransactions]);
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };
  
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    await addTransaction(transaction);
    setShowAddModal(false);
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
  
  if (!selectedWallet) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p>Loading wallet details...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <Button
          variant="outline"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => window.location.href = '/wallets'}
          className="mb-4"
        >
          Back to Wallets
        </Button>
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">{selectedWallet.name}</h2>
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
          >
            Add Transaction
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">Current Balance</h3>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(selectedWallet.balance, selectedWallet.currency)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                <span className="text-sm font-medium">{selectedWallet.currency}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={transactions}
            wallets={wallets}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </CardContent>
      </Card>
      
      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Transaction"
      >
        <TransactionForm
          wallets={wallets}
          selectedWalletId={selectedWallet.id}
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