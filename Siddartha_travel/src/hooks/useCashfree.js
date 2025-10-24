// src/hooks/useCashfree.js
import { useState, useEffect } from 'react';
import { load } from '@cashfreepayments/cashfree-js';

export const useCashfree = () => {
  const [cashfree, setCashfree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCashfree = async () => {
      try {
        setLoading(true);
        const cashfreeInstance = await load({
          mode: process.env.REACT_APP_CASHFREE_ENV === "production" ? "production" : "sandbox"
        });
        setCashfree(cashfreeInstance);
      } catch (err) {
        console.error("Failed to initialize Cashfree:", err);
        setError(err.message || "Failed to initialize payment service");
      } finally {
        setLoading(false);
      }
    };

    initializeCashfree();
  }, []);

  return { cashfree, loading, error };
};