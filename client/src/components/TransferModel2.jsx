// import React, { useState } from 'react';
// import Modal from './Modal';
// import VerificationModal from './VerificationModal';
// import styles from '../css/TransferModal.module.css';
// import api from '../services/api';

// function TransferModal({ isOpen, onClose, onTransferSuccess }) {
//   const [amount, setAmount] = useState('');
//   const [recipient, setRecipient] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
//   const [pendingTransfer, setPendingTransfer] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       // First, request transfer and get verification code
//       const response = await api.post('/users/transactions/', {
//         amount: Number(amount),
//         email: recipient
//       });

//       if (response.status === 200) {
//         setPendingTransfer({ amount, recipient });
//         setIsVerificationModalOpen(true);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || 'Transfer failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerify = async (code) => {
//     try {
//       const response = await api.post('/transactions/transfer/verify', {
//         code,
//         amount: Number(pendingTransfer.amount),
//         to: pendingTransfer.recipient
//       });

//       if (response.status === 200) {
//         setIsVerificationModalOpen(false);
//         onTransferSuccess();
//         onClose();
//         setAmount('');
//         setRecipient('');
//       }
//     } catch (error) {
//       alert('Invalid verification code');
//     }
//   };

//   const handleResendCode = async () => {
//     try {
//       await api.post('/transactions/transfer/resend-code');
//       alert('New verification code has been sent to your email');
//     } catch (error) {
//       alert('Failed to resend verification code');
//     }
//   };

//   return (
//     <>
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <div className={styles.transferModal}>
//           <h2>Transfer Money</h2>
//           {error && <div className={styles.error}>{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div className={styles.inputGroup}>
//               <label htmlFor="recipient">Recipient Email:</label>
//               <input
//                 id="recipient"
//                 type="email"
//                 value={recipient}
//                 onChange={(e) => setRecipient(e.target.value)}
//                 required
//                 placeholder="Enter recipient's email"
//               />
//             </div>
//             <div className={styles.inputGroup}>
//               <label htmlFor="amount">Amount ($):</label>
//               <input
//                 id="amount"
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 required
//                 min="0.01"
//                 step="0.01"
//                 placeholder="Enter amount"
//               />
//             </div>
//             <div className={styles.buttons}>
//               <button 
//                 type="button" 
//                 onClick={onClose}
//                 className={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit" 
//                 disabled={isLoading}
//                 className={styles.submitButton}
//               >
//                 {isLoading ? 'Processing...' : 'Transfer'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>

//       <VerificationModal
//         isOpen={isVerificationModalOpen}
//         onClose={() => setIsVerificationModalOpen(false)}
//         onVerify={handleVerify}
//         onResend={handleResendCode}
//         title="Verify Transfer"
//         message="Please enter the verification code sent to your email to complete the transfer"
//       />
//     </>
//   );
// }

// export default TransferModal; 