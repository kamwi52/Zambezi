import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CheckCircle, Lock, Smartphone, Loader2, LogOut, Radio, Wifi, AlertCircle } from 'lucide-react';

interface PaymentProps {
  user: User;
  onPaymentSuccess: () => void;
  onLogout: () => void;
}

const Payment: React.FC<PaymentProps> = ({ user, onPaymentSuccess, onLogout }) => {
  const [selectedProvider, setSelectedProvider] = useState<'airtel' | 'mtn' | 'zamtel' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'waiting_for_pin' | 'success'>('idle');
  const [paymentPhone, setPaymentPhone] = useState(user.phoneNumber);

  const handlePay = () => {
    setPaymentStatus('processing');
    
    // Step 1: Simulate network request to Payment Gateway
    setTimeout(() => {
      setPaymentStatus('waiting_for_pin');
    }, 2000);
  };

  // Step 2 & 3: Simulate User entering PIN on phone and Gateway confirming
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (paymentStatus === 'waiting_for_pin') {
        timeout = setTimeout(() => {
            setPaymentStatus('success');
        }, 5000); // 5 seconds to simulate user typing PIN
    }
    return () => clearTimeout(timeout);
  }, [paymentStatus]);

  if (paymentStatus === 'success') {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-scale-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-green-200 shadow-lg">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-8">Your subscription is active. You now have full access to all subjects and the AI Tutor.</p>
                <button
                    onClick={onPaymentSuccess}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all transform hover:scale-[1.02]"
                >
                    Start Learning
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden relative transition-all">
        {paymentStatus === 'idle' && (
            <button 
                onClick={onLogout}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors z-10"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
        )}

        <div className="p-8 pb-0 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unlock Premium Access</h1>
            <p className="text-gray-500 text-sm">One-time payment of <span className="text-gray-900 font-bold">K 10.00</span> for unlimited access.</p>
        </div>

        <div className="p-8">
            {paymentStatus === 'idle' ? (
                <>
                    <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Select Payment Method</h3>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button
                            onClick={() => setSelectedProvider('airtel')}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedProvider === 'airtel' ? 'border-red-600 bg-red-50 shadow-md' : 'border-gray-100 hover:border-red-200'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">AM</div>
                            <span className="text-xs font-bold text-gray-700">Airtel</span>
                        </button>
                        <button
                            onClick={() => setSelectedProvider('mtn')}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedProvider === 'mtn' ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-100 hover:border-yellow-200'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs">MoMo</div>
                            <span className="text-xs font-bold text-gray-700">MTN</span>
                        </button>
                        <button
                            onClick={() => setSelectedProvider('zamtel')}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedProvider === 'zamtel' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-100 hover:border-green-200'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">Z</div>
                            <span className="text-xs font-bold text-gray-700">Zamtel</span>
                        </button>
                    </div>

                    {selectedProvider && (
                        <div className="animate-fade-in space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Money Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Smartphone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={paymentPhone}
                                        onChange={(e) => setPaymentPhone(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handlePay}
                                className={`w-full py-3 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                                    selectedProvider === 'airtel' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                                    selectedProvider === 'mtn' ? 'bg-yellow-500 text-black hover:bg-yellow-600 shadow-yellow-200' :
                                    'bg-green-600 hover:bg-green-700 shadow-green-200'
                                }`}
                            >
                                Pay K 10.00
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8">
                     <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Smartphone className="text-gray-400 animate-pulse" size={32} />
                        </div>
                     </div>
                     
                     <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {paymentStatus === 'processing' ? 'Initiating Payment...' : 'Check your phone!'}
                     </h2>
                     
                     {paymentStatus === 'waiting_for_pin' && (
                        <div className="animate-fade-in">
                             <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                                We've sent a PIN prompt to <span className="font-bold text-gray-800">{paymentPhone}</span>. 
                                Please enter your Mobile Money PIN to authorize the transaction.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium border border-yellow-100">
                                <AlertCircle size={14} /> Waiting for confirmation...
                            </div>
                        </div>
                     )}
                     
                     {paymentStatus === 'processing' && (
                        <p className="text-gray-400 text-sm">Connecting to {selectedProvider?.toUpperCase()} network...</p>
                     )}
                </div>
            )}
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="text-xs text-gray-400 max-w-xs">Secure payment processed via mobile money. By paying, you agree to our terms of service.</p>
      </div>
    </div>
  );
};

export default Payment;