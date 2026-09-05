// Mirrors kidora-be's db/paymentStore.js payment shape (see toPayment)
// plus the admin-only join fields (customerName/customerEmail, same
// pattern as AdminOrder in types/order.ts) and displayStatus, which
// kidora-be's services/paymentService.js computes server-side — see that
// file's computeDisplayStatus for exactly how 'captured' splits into
// "paid" vs "needs_attention" depending on whether an order got linked.
export type PaymentDbStatus = "created" | "captured" | "refunding" | "refunded" | "failed";

export type PaymentDisplayStatus =
    | "pending"
    | "paid"
    | "needs_attention"
    | "refund_initiated"
    | "refund_completed"
    | "failed";

export type AdminPayment = {
    id: string;
    userId: string;
    bookId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    status: PaymentDbStatus;
    displayStatus: PaymentDisplayStatus;
    amount: number;
    currency: string;
    couponCode: string | null;
    orderId: string | null;
    failureReason: string | null;
    refundId: string | null;
    refundedAt: string | null;
    createdAt: string;
    updatedAt: string;
    customerName: string | null;
    customerEmail: string | null;
};
