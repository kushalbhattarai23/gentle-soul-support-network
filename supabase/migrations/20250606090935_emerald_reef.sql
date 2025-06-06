/*
  # Add wallet balance update function

  1. Functions
    - `update_wallet_balance` - Function to update wallet balance when transactions are added/modified
  
  2. Security
    - Function uses security definer to allow balance updates
*/

CREATE OR REPLACE FUNCTION update_wallet_balance(wallet_id uuid, amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE wallets 
  SET balance = balance + amount 
  WHERE id = wallet_id;
END;
$$;