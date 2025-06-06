import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { WalletCard } from '../components/wallets/WalletCard';
import { Modal } from '../components/ui/Modal';
import { WalletForm } from '../components/wallets/WalletForm';
import { useWalletStore } from '../store/walletStore';
import { Wallet } from '../types';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const WalletsPage: React.FC = () => {
  const { wallets, fetchWallets, addWallet, updateWallet, deleteWallet, isLoading } = useWalletStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Modals states for edit and delete remain local for now
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  // The "Add Wallet" modal is now controlled by URL param `modal=add`
  const showAddModal = searchParams.get('modal') === 'add';

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleAddWallet = async (wallet: Omit<Wallet, 'id' | 'user_id' | 'created_at'>) => {
    await addWallet(wallet);
    setSearchParams({}); // Close modal by clearing query param
  };

  const handleEditWallet = async (wallet: Omit<Wallet, 'id' | 'user_id' | 'created_at'>) => {
    if (selectedWallet) {
      await updateWallet(selectedWallet.id, wallet);
      setShowEditModal(false);
      setSelectedWallet(null);
    }
  };

  const handleDeleteWallet = async () => {
    if (selectedWallet) {
      await deleteWallet(selectedWallet.id);
      setShowDeleteModal(false);
      setSelectedWallet(null);
    }
  };

  const openEditModal = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowEditModal(true);
  };

  const openDeleteModal = (id: string) => {
    const wallet = wallets.find(w => w.id === id) || null;
    setSelectedWallet(wallet);
    setShowDeleteModal(true);
  };

  const navigateToWalletDetails = (wallet: Wallet) => {
    window.location.href = `/wallets/${wallet.id}`;
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Wallets</h2>
        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => setSearchParams({ modal: 'add' })}
        >
          Add Wallet
        </Button>
      </div>

      {wallets.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
          <h3 className="text-lg font-medium text-slate-900 mb-2">No wallets found</h3>
          <p className="text-slate-500 mb-4">Get started by creating your first wallet.</p>
          <Button onClick={() => setSearchParams({ modal: 'add' })}>Add Wallet</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onSelect={navigateToWalletDetails}
            />
          ))}
        </div>
      )}

      {/* Add Wallet Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setSearchParams({})}
        title="Add New Wallet"
      >
        <WalletForm
          onSubmit={handleAddWallet}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Wallet Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedWallet(null);
        }}
        title="Edit Wallet"
      >
        {selectedWallet && (
          <WalletForm
            wallet={selectedWallet}
            onSubmit={handleEditWallet}
            isLoading={isLoading}
          />
        )}
      </Modal>

      {/* Delete Wallet Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedWallet(null);
        }}
        title="Delete Wallet"
        size="sm"
      >
        <div className="text-center">
          <p className="mb-4">
            Are you sure you want to delete the wallet "{selectedWallet?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedWallet(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteWallet}
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
