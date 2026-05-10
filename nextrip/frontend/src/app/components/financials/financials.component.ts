import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financials.component.html'
})
export class FinancialsComponent {
  
  // --- Core Financial Data ---
  availableBalance = 1245000; // Dynamic Balance
  
  get formattedBalance() {
    return '₹' + this.availableBalance.toLocaleString('en-IN');
  }

  // --- Bank Accounts State ---
  bankAccounts = [
    { id: 1, bankName: 'HDFC Bank', accountNo: '4567' },
    { id: 2, bankName: 'ICICI Bank', accountNo: '8901' }
  ];

  // --- Modal States ---
  isDropdownOpen = false;
  selectedTimeframe = 'This Month';
  
  showAddModal = false;
  showWithdrawModal = false;
  showBankModal = false;

  // --- Form Models ---
  newTransaction = { description: '', type: 'Income', amount: '' };
  withdrawData = { amount: '', bankId: this.bankAccounts[0]?.id || '' };
  newBankData = { bankName: '', accountNo: '' };

  // Data Arrays
  financialStats: any[] = [];
  revenueByCategory: any[] = [];
  transactions: any[] = [];

  constructor() {
    this.changeTimeframe('This Month');
  }

  // --- Dropdown Logic ---
  changeTimeframe(timeframe: string) {
    this.selectedTimeframe = timeframe;
    this.isDropdownOpen = false;

    if (timeframe === 'This Month') {
      this.financialStats = [
        { title: 'Total Revenue', value: '₹42,50,000', trend: '+15.2%', isPositive: true },
        { title: 'Total Expenses', value: '₹12,20,000', trend: '-2.4%', isPositive: true },
        { title: 'Net Profit', value: '₹30,30,000', trend: '+22.5%', isPositive: true },
        { title: 'Pending Payouts', value: '₹3,45,000', trend: '+5.1%', isPositive: false }
      ];
      this.revenueByCategory = [
        { category: 'Holiday Packages', amount: '₹24,00,000', percentage: 75, color: 'bg-red-600' },
        { category: 'Flight Bookings', amount: '₹12,50,000', percentage: 55, color: 'bg-blue-500' },
        { category: 'Hotel Reservations', amount: '₹4,80,000', percentage: 35, color: 'bg-green-500' },
        { category: 'Activities & Tours', amount: '₹1,20,000', percentage: 15, color: 'bg-yellow-500' }
      ];
      this.transactions = [
        { id: 'TXN-9081', date: '10 May 2026, 14:30', description: 'Payment from Rahul Sharma', type: 'Income', amount: '+₹95,000', status: 'Completed' },
        { id: 'TXN-9080', date: '09 May 2026, 11:15', description: 'Hotel Partner Payout (Taj)', type: 'Payout', amount: '-₹45,000', status: 'Completed' },
        { id: 'TXN-9079', date: '09 May 2026, 09:45', description: 'Payment from Priya Patel', type: 'Income', amount: '+₹65,000', status: 'Completed' },
        { id: 'TXN-9078', date: '08 May 2026, 16:20', description: 'Flight Partner Payout (IndiGo)', type: 'Payout', amount: '-₹1,10,000', status: 'Pending' }
      ];
    } else {
      // Last Month Data... (Keep your existing last month data here)
      this.transactions = []; // Truncated for brevity
    }
  }

  // --- Modal Toggle Functions ---
  openAddModal() { this.newTransaction = { description: '', type: 'Income', amount: '' }; this.showAddModal = true; }
  closeAddModal() { this.showAddModal = false; }

  openWithdrawModal() { 
    if(this.bankAccounts.length === 0) {
      alert("Please add a Bank Account first!");
      return;
    }
    this.withdrawData = { amount: '', bankId: this.bankAccounts[0].id }; 
    this.showWithdrawModal = true; 
  }
  closeWithdrawModal() { this.showWithdrawModal = false; }

  openBankModal() { this.newBankData = { bankName: '', accountNo: '' }; this.showBankModal = true; }
  closeBankModal() { this.showBankModal = false; }


  // --- Actions Logic ---

  // 1. Add Manual Entry
  saveTransaction() {
    if (!this.newTransaction.description || !this.newTransaction.amount) return;

    let rawAmount = this.newTransaction.amount.replace(/[^0-9]/g, ''); 
    if(!rawAmount) rawAmount = '0';

    let prefix = this.newTransaction.type === 'Income' ? '+₹' : '-₹';
    let formattedAmount = prefix + Number(rawAmount).toLocaleString('en-IN');
    
    // Available Balance Update
    if(this.newTransaction.type === 'Income') {
        this.availableBalance += Number(rawAmount);
    } else {
        this.availableBalance -= Number(rawAmount);
    }

    this.transactions.unshift({
      id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
      date: this.getCurrentDate(),
      description: this.newTransaction.description,
      type: this.newTransaction.type,
      amount: formattedAmount,
      status: 'Completed'
    });

    this.closeAddModal();
  }

  // 2. Withdraw Funds Logic
  processWithdraw() {
    let rawAmount = Number(this.withdrawData.amount.replace(/[^0-9]/g, ''));
    if(!rawAmount || rawAmount <= 0) return alert('Enter a valid amount');
    if(rawAmount > this.availableBalance) return alert('Insufficient Balance!');

    // Deduct Balance
    this.availableBalance -= rawAmount;

    // Find selected bank
    let bank = this.bankAccounts.find(b => b.id == this.withdrawData.bankId);

    // Add to table
    this.transactions.unshift({
      id: 'WD-' + Math.floor(1000 + Math.random() * 9000),
      date: this.getCurrentDate(),
      description: `Withdrawal to ${bank?.bankName} (..${bank?.accountNo.slice(-4)})`,
      type: 'Payout',
      amount: '-₹' + rawAmount.toLocaleString('en-IN'),
      status: 'Pending' // Withdrawals are usually pending initially
    });

    this.closeWithdrawModal();
  }

  // 3. Manage Banks Logic
  addBank() {
    if(!this.newBankData.bankName || !this.newBankData.accountNo) return alert('Enter Bank details');
    this.bankAccounts.push({
      id: Math.random(),
      bankName: this.newBankData.bankName,
      accountNo: this.newBankData.accountNo
    });
    this.newBankData = { bankName: '', accountNo: '' }; // Reset fields
  }

  removeBank(id: number) {
    if(confirm("Remove this bank account?")) {
      this.bankAccounts = this.bankAccounts.filter(b => b.id !== id);
    }
  }

  // --- Helpers ---
  getCurrentDate() {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Income': return 'text-green-600 bg-green-50';
      case 'Payout': return 'text-blue-600 bg-blue-50';
      case 'Refund': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }
}