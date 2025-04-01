declare module 'react-native-razorpay' {
  interface RazorpayOptions {
    description: string;
    image?: any;
    currency: string;
    key: string;
    amount: string;
    name: string;
    order_id: string;
    prefill?: {
      email?: string;
      contact?: string;
      name?: string;
    };
    theme?: { color: string };
  }

  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  const RazorpayCheckout: {
    open(options: RazorpayOptions): Promise<RazorpayResponse>;
  };
  export default RazorpayCheckout;
} 