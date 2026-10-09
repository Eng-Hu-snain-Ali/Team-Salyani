import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Printer,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type { PaymentMethod } from '../../types';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentBooking,
    processPayment,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [mobileWalletNumber, setMobileWalletNumber] = useState('0300-8645123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReceiptView, setIsReceiptView] = useState(false);
  const [txnReceiptId, setTxnReceiptId] = useState('');

  if (!isPaymentModalOpen || !paymentBooking) return null;

  const totalAmount = paymentBooking.finalPrice || paymentBooking.estimatedPrice;

  const handlePay = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      await processPayment(paymentBooking.id, selectedMethod);
      setTxnReceiptId(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsProcessing(false);
      setIsReceiptView(true);
    }, 1200);
  };

  const handleClose = () => {
    setIsPaymentModalOpen(false);
    setIsReceiptView(false);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-surface payment-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-modal-header">
          <div>
            <span className="pay-modal-badge">
              <Info size={12} /> Functional Sandbox Demo
            </span>
            <h2 className="pay-modal-title">
              {isReceiptView ? 'Payment Receipt' : 'Complete Service Payment'}
            </h2>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Close payment modal">
            <X size={20} />
          </button>
        </div>

        {isReceiptView ? (
          /* RECEIPT / INVOICE VIEW */
          <div className="receipt-container">
            <div className="receipt-success-icon">
              <CheckCircle2 size={44} className="text-success" />
            </div>
            <h3 className="receipt-heading">Payment Completed Successfully!</h3>
            <span className="receipt-subtitle">
              Transaction ID: <strong>{txnReceiptId}</strong>
            </span>

            <div className="receipt-slip-card">
              <div className="receipt-slip-header">
                <strong>USTAD ONLINE FAISALABAD</strong>
                <span>Official Digital Tax Invoice</span>
              </div>
              <div className="slip-divider" />
              <div className="slip-row">
                <span>Booking ID:</span>
                <strong>{paymentBooking.id}</strong>
              </div>
              <div className="slip-row">
                <span>Service:</span>
                <span>{paymentBooking.serviceName}</span>
              </div>
              <div className="slip-row">
                <span>Assigned Ustad:</span>
                <span>{paymentBooking.ustadName || 'Ustad Technician'}</span>
              </div>
              <div className="slip-row">
                <span>Customer:</span>
                <span>{paymentBooking.userName}</span>
              </div>
              <div className="slip-row">
                <span>Payment Mode:</span>
                <strong className="text-uppercase">{selectedMethod}</strong>
              </div>
              <div className="slip-row">
                <span>Paid At:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="slip-divider" />
              <div className="slip-total-row">
                <span>Total Paid:</span>
                <strong>Rs. {totalAmount}</strong>
              </div>
            </div>

            <div className="receipt-actions">
              <button
                className="print-btn"
                onClick={() => window.print()}
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                className="done-btn-primary"
                onClick={handleClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT SELECTION VIEW */
          <div className="payment-selection-content">
            <div className="payment-amount-hero">
              <span className="amount-label">Amount Payable:</span>
              <h1 className="amount-val">Rs. {totalAmount}</h1>
              <span className="amount-service-tag">{paymentBooking.serviceName}</span>
            </div>

            <div className="payment-methods-list">
              <div
                className={`payment-method-card ${selectedMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('cash')}
              >
                <div className="method-icon-box cash">
                  <Banknote size={22} />
                </div>
                <div className="method-text">
                  <strong>Cash on Delivery (Hand-to-Hand)</strong>
                  <span>Pay cash directly to Ustad after job inspection.</span>
                </div>
                <input
                  type="radio"
                  name="payMethod"
                  checked={selectedMethod === 'cash'}
                  readOnly
                />
              </div>

              <div
                className={`payment-method-card ${selectedMethod === 'easypaisa' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('easypaisa')}
              >
                <div className="method-icon-box easypaisa">
                  <Smartphone size={22} />
                </div>
                <div className="method-text">
                  <strong>Easypaisa Mobile Account</strong>
                  <span>Direct mobile wallet transfer to Telenor Microfinance.</span>
                </div>
                <input
                  type="radio"
                  name="payMethod"
                  checked={selectedMethod === 'easypaisa'}
                  readOnly
                />
              </div>

              <div
                className={`payment-method-card ${selectedMethod === 'jazzcash' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('jazzcash')}
              >
                <div className="method-icon-box jazzcash">
                  <CreditCard size={22} />
                </div>
                <div className="method-text">
                  <strong>JazzCash Wallet</strong>
                  <span>Pay with JazzCash App or USSD *786# PIN.</span>
                </div>
                <input
                  type="radio"
                  name="payMethod"
                  checked={selectedMethod === 'jazzcash'}
                  readOnly
                />
              </div>
            </div>

            {/* Mobile Wallet Phone input if electronic */}
            {selectedMethod !== 'cash' && (
              <div className="wallet-input-group">
                <label className="wallet-label">
                  Enter {selectedMethod.toUpperCase()} Mobile Number:
                </label>
                <input
                  type="text"
                  className="wallet-input"
                  value={mobileWalletNumber}
                  onChange={(e) => setMobileWalletNumber(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                />
                <small className="wallet-hint">
                  Demo Mode: Instant simulated debit without deducting real balance.
                </small>
              </div>
            )}

            <div className="secure-badge-row">
              <ShieldCheck size={16} className="text-success" />
              <span>100% Secure Simulated Transaction • Platform Commission (10%) Auto-calculated.</span>
            </div>

            <div className="payment-modal-footer">
              <button
                className="cancel-btn"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="submit-payment-btn"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? 'Simulating Payment...' : `Confirm Payment of Rs. ${totalAmount}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
