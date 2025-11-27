import React, { useState, useRef } from 'react';
import { Smartphone, ArrowRight, BookOpen, KeyRound, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (phoneNumber: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validatePhone = (number: string) => {
    // Zambian phone numbers: 10 digits, starts with 09 or 07
    const regex = /^0(9|7)[0-9]{8}$/;
    return regex.test(number);
  };

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhone(phone)) {
      setLoading(true);
      setError('');
      
      const code = generateOtp();
      setGeneratedOtp(code);

      // Simulate API call to send SMS
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
        // OTP is now displayed on screen
      }, 1500);
    } else {
      setError('Please enter a valid Zambian phone number (e.g., 097xxxxxxx)');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    setLoading(true);
    
    // Simulate verification
    setTimeout(() => {
        setLoading(false);
        if (code === generatedOtp || code === '1234') { // Allow 1234 for testing convenience
            onLogin(phone);
        } else {
            setError('Invalid code. Please try again.');
        }
    }, 1500);
  };

  const handleResendOtp = () => {
    setLoading(true);
    const code = generateOtp();
    setGeneratedOtp(code);
    setOtp(['', '', '', '']);
    
    setTimeout(() => {
        setLoading(false);
        // OTP is displayed on screen
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="bg-green-700 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg border border-white/30">
                🇿🇲
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Zambezi</h1>
            <p className="text-green-100 font-medium">Smart Learn App</p>
        </div>

        <div className="p-8">
            {step === 'phone' ? (
                <>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Login to your account</h2>
                    <form onSubmit={handlePhoneSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Smartphone size={20} />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value.replace(/\D/g, ''));
                                        setError('');
                                    }}
                                    placeholder="097xxxxxxx"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                    maxLength={10}
                                    autoFocus
                                />
                            </div>
                            {error && <p className="mt-2 text-sm text-red-500 animate-pulse">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || phone.length < 10}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
                        </button>
                    </form>
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>We will send you a verification code.</p>
                    </div>
                </>
            ) : (
                <>
                    <button 
                        onClick={() => { setStep('phone'); setError(''); setOtp(['','','','']); }} 
                        className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Wrong number?
                    </button>
                    
                    {generatedOtp && (
                      <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 animate-fade-in">
                        <div className="bg-blue-100 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                          <MessageCircle size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-500 font-bold uppercase mb-0.5">Test Message</p>
                          <p className="text-sm font-medium">Your verification code is <span className="font-bold text-lg tracking-widest text-blue-700 ml-1">{generatedOtp}</span></p>
                        </div>
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Verification</h2>
                    <p className="text-center text-gray-500 mb-8 text-sm">Enter the 4-digit code sent to <br/><span className="font-bold text-gray-800">{phone}</span></p>
                    
                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                        <div className="flex justify-center gap-4">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => otpRefs.current[idx] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-800"
                                    autoFocus={idx === 0}
                                />
                            ))}
                        </div>
                        {error && <p className="text-center text-sm text-red-500 animate-pulse">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading || otp.some(d => !d)}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Verify Code <KeyRound size={20} /></>}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-400">Didn't receive code? </span>
                        <button 
                            type="button" 
                            onClick={handleResendOtp}
                            className="text-green-600 font-semibold hover:underline"
                        >
                            Resend
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
      <div className="mt-8 flex items-center gap-2 text-gray-400 text-sm">
         <BookOpen size={16} /> Powering Education in Zambia
      </div>
    </div>
  );
};

export default Login;