import "../DriverWallet/DriverWallet.css";
import React, { useState, useEffect } from "react";
import {
  getWalletBalance,
  addWalletBalance,
  getWalletTransactionHistory,
} from "../../../api/driverApi"; // Import API functions

const DriverWallet = () => {
  const [activeTab, setActiveTab] = useState("balance");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchBalance();
    fetchTransactionHistory();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await getWalletBalance();
      if (response?.data?.balance !== undefined) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await getWalletTransactionHistory();
      if (response?.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch transaction history:", error);
    }
  };

  const handleAddBalance = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      const response = await addWalletBalance(amt);
      if (response?.data?.balance !== undefined) {
        setBalance(response.data.balance);
        fetchTransactionHistory();
      }
    } catch (error) {
      console.error("Failed to add balance:", error);
    }

    setAmount("");
    setActiveTab("balance");
  };

  return (
    <div className="wallet-container">
      <h2>Driver Wallet</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "balance" ? "active" : ""}
          onClick={() => setActiveTab("balance")}
        >
          Wallet Balance
        </button>
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Balance
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Transaction History
        </button>
      </div>

      {/* Wallet Balance */}
      {activeTab === "balance" && (
        <div className="tab-content balance">
          <p>Your Balance:</p>
          <h3>${balance.toFixed(2)}</h3>
        </div>
      )}

      {/* Add Balance */}
      {activeTab === "add" && (
        <div className="tab-content add">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <button onClick={handleAddBalance}>Add Money</button>
        </div>
      )}

      {/* Transaction History */}
      {activeTab === "history" && (
        <div className="tab-content history">
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul className="transaction-list">
              {transactions.map((txn) => (
                <li
                  key={txn.transactionId}
                  className={txn.transactionType.toLowerCase()}
                >
                  <div className="transaction-header">
                    <strong>
                      {txn.transactionType === "CREDIT"
                        ? "💰 Credit"
                        : "💸 Debit"}
                    </strong>
                    <span> | {txn.transactionMethod}</span>
                    <span> | {txn.transactionStatus}</span>
                  </div>
                  <div className="transaction-body">
                    <span className="date">
                      {txn.transactionTime
                        ? new Date(txn.transactionTime).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="amount">
                      {txn.transactionType === "CREDIT" ? "+" : "-"}$
                      {txn.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="transaction-footer">
                    <span className="description">{txn.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverWallet;
