
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, set, push, update } from 'firebase/database';
import { useAuth } from './auth-context';
import { v4 as uuidv4 } from 'uuid';

type TaskTransaction = {
    id: string;
    date: string;
    status: 'Hoàn thành';
    amount: number;
};

type WithdrawalTransaction = {
    id: string;
    date: string;
    amount: number;
    method: 'Momo' | 'MB Bank';
    status: 'Thành công' | 'Đang chờ';
};

type BalanceContextType = {
  balance: number;
  taskHistory: TaskTransaction[];
  withdrawalHistory: WithdrawalTransaction[];
  addBalance: (amount: number) => void;
  addTransaction: (transaction: Omit<TaskTransaction, 'date' | 'id' | 'status'>) => void;
  requestWithdrawal: (amount: number, method: 'Momo' | 'MB Bank') => Promise<boolean>;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [taskHistory, setTaskHistory] = useState<TaskTransaction[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalTransaction[]>([]);

  useEffect(() => {
    if (!user) return;

    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setBalance(data.balance || 0);
            const tasks = data.taskHistory 
                ? Object.entries(data.taskHistory).map(([id, task]: any) => ({ id, ...task })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
                : [];
            setTaskHistory(tasks);
            
            const withdrawals = data.withdrawalHistory 
                ? Object.entries(data.withdrawalHistory).map(([id, w]: any) => ({ id, ...w })).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
                : [];
            setWithdrawalHistory(withdrawals);

        } else {
            set(userRef, { balance: 0, taskHistory: {}, withdrawalHistory: {} });
        }
    });

    return () => unsubscribe();
  }, [user]);

  const addBalance = (amount: number) => {
    if (!user) return;
    const newBalance = balance + amount;
    const userRef = ref(database, `users/${user.uid}/balance`);
    set(userRef, newBalance);
  };

  const addTransaction = (transaction: Omit<TaskTransaction, 'date' | 'id' | 'status'>) => {
    if (!user) return;
    const tasksRef = ref(database, `users/${user.uid}/taskHistory`);
    const newTaskRef = push(tasksRef);
    const newTransactionData = {
        ...transaction,
        id: newTaskRef.key!,
        date: new Date().toISOString(),
        status: 'Hoàn thành' as const
    }
    set(newTaskRef, newTransactionData);
  };

  const requestWithdrawal = async (amount: number, method: 'Momo' | 'MB Bank'): Promise<boolean> => {
    if (!user || balance < amount) {
      return false;
    }
    
    try {
        const newBalance = balance - amount;
        const newWithdrawalRef = push(ref(database, `users/${user.uid}/withdrawalHistory`));
        const withdrawalId = newWithdrawalRef.key || uuidv4();

        const updates: { [key: string]: any } = {};
        updates[`/users/${user.uid}/balance`] = newBalance;
        updates[`/users/${user.uid}/withdrawalHistory/${withdrawalId}`] = {
            id: withdrawalId,
            date: new Date().toISOString(),
            amount,
            method,
            status: 'Đang chờ'
        };
        
        await update(ref(database), updates);
        return true;
    } catch (error) {
        console.error("Withdrawal request failed:", error);
        return false;
    }
  };

  const value = { balance, taskHistory, withdrawalHistory, addBalance, addTransaction, requestWithdrawal };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useUserBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useUserBalance must be used within a BalanceProvider');
  }
  return context;
};
