import api from '../config/api';
import type { ApiResponse, OTPVerificationData, OTPSendResponse } from '../types';

interface VerifyOTPResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    username: string;
    isEmailVerified: boolean;
  };
}

export const otpService = {
  sendVerificationOTP: async (email: string): Promise<ApiResponse<OTPSendResponse>> => {
    try {
      const response = await api.post<ApiResponse<OTPSendResponse>>('/otp/send-verification', { email });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  },

  verifyEmail: async (data: OTPVerificationData): Promise<ApiResponse<VerifyOTPResponse>> => {
    try {
      const response = await api.post<ApiResponse<VerifyOTPResponse>>('/otp/verify-email', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Verification failed. Please try again.' };
    }
  },

  resendVerificationOTP: async (email: string): Promise<ApiResponse<OTPSendResponse>> => {
    try {
      const response = await api.post<ApiResponse<OTPSendResponse>>('/otp/resend-verification', { email });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to resend OTP. Please try again.' };
    }
  },
};
