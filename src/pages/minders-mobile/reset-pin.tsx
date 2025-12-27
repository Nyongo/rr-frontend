
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Shield, RefreshCw, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResetPin = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const navigate = useNavigate();

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Handle different input scenarios
    let formatted = '';
    
    if (cleaned.startsWith('254')) {
      // Already has country code 254
      if (cleaned.length <= 12) {
        formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
      } else {
        formatted = cleaned.slice(0, 12).replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
      }
    } else if (cleaned.startsWith('0')) {
      // Starts with 0, replace with 254
      const withoutZero = cleaned.slice(1);
      if (withoutZero.length <= 9) {
        const fullNumber = '254' + withoutZero;
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
      } else {
        const fullNumber = '254' + withoutZero.slice(0, 9);
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
      }
    } else if (cleaned.length > 0) {
      // No country code, add 254
      if (cleaned.length <= 9) {
        const fullNumber = '254' + cleaned;
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
      } else {
        const fullNumber = '254' + cleaned.slice(0, 9);
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(formatPhoneNumber(value));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handlePinDigit = (digit: string) => {
    if (newPin.length < 4) {
      setNewPin(prev => prev + digit);
    }
  };

  const handlePinDelete = () => {
    setNewPin(prev => prev.slice(0, -1));
  };

  const handleResetPin = () => {
    if (step === 1 && phoneNumber) {
      setStep(2);
    } else if (step === 2 && otp.length === 6) {
      setStep(3);
    } else if (step === 3 && newPin.length === 4) {
      setStep(4);
    }
  };

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/minders-mobile")}
          className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all mr-4"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reset PIN</h1>
          <p className="text-gray-600">Step {step} of 4</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-full p-1 mb-8 shadow-sm">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      {/* Step 1: Phone Number */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enter Your Phone Number</h2>
            <p className="text-gray-600">We'll send you a verification code</p>
          </div>

          <Input
            type="tel"
            placeholder="+254 712 345 678"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="text-lg p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 mb-6"
            maxLength={17}
          />

          <Button
            onClick={handleResetPin}
            disabled={!phoneNumber}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-4 rounded-xl font-semibold"
          >
            Send Verification Code
          </Button>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enter Verification Code</h2>
            <p className="text-gray-600">Check your SMS for the 6-digit code</p>
          </div>

          <Input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={handleOtpChange}
            className="text-lg p-4 border-2 border-gray-200 rounded-xl focus:border-green-400 mb-6 text-center font-mono tracking-widest"
            maxLength={6}
          />

          <Button
            onClick={handleResetPin}
            disabled={otp.length !== 6}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg py-4 rounded-xl font-semibold"
          >
            Verify Code
          </Button>
        </div>
      )}

      {/* Step 3: New PIN */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Create New PIN</h2>
            <p className="text-gray-600">Enter your new 4-digit PIN</p>
          </div>

          {/* PIN Display */}
          <div className="flex justify-center gap-3 mb-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                  index < newPin.length
                    ? 'border-orange-400 bg-orange-50 text-orange-600 scale-110'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {index < newPin.length && '•'}
              </div>
            ))}
          </div>

          {/* Dial Pad */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {dialPadNumbers.map((row, rowIndex) =>
              row.map((item, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => {
                    if (item === 'delete') {
                      handlePinDelete();
                    } else if (item !== '') {
                      handlePinDigit(item);
                    }
                  }}
                  className={`h-14 rounded-xl font-semibold text-xl transition-all duration-200 ${
                    item === 'delete'
                      ? 'bg-red-100 text-red-600 hover:bg-red-200 active:scale-95'
                      : item === ''
                      ? 'invisible'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200 active:scale-95 hover:scale-105'
                  }`}
                  disabled={item === ''}
                >
                  {item === 'delete' ? '⌫' : item}
                </button>
              ))
            )}
          </div>

          <Button
            onClick={handleResetPin}
            disabled={newPin.length !== 4}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg py-4 rounded-xl font-semibold"
          >
            Set New PIN
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">PIN Reset Successful!</h2>
          <p className="text-gray-600 mb-8">Your new PIN has been set successfully</p>
          
          <Button
            onClick={() => navigate("/minders-mobile")}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg py-4 rounded-xl font-semibold"
          >
            Return to Sign In
          </Button>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-20 right-8 w-6 h-6 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-40 left-10 w-8 h-8 bg-purple-400 rounded-full opacity-50 animate-pulse"></div>
    </div>
  );
};

export default ResetPin;
