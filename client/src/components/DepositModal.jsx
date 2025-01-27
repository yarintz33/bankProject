import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import api from '../services/api.js';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function DepositModal({ isOpen, onClose, onDepositSuccess }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await api.post('/users/deposit', { amount: parseFloat(amount) });
      setAmount('');
      onDepositSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to process deposit');
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="deposit-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography id="deposit-modal-title" variant="h6" component="h2" mb={3}>
          Deposit Money
        </Typography>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount ($)"
            maxLength="6"
          />
          <div className="verification-buttons">
            <button type="submit">Deposit</button>
            <button 
              type="button" 
              onClick={onClose} 
            >
              cancel
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default DepositModal;