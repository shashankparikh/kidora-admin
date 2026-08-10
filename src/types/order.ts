// "success" here is a display-level alias — kidora-be stores it as
// 'delivered' internally (there's no payment gateway yet, so every order
// is created already-delivered) and translates at the API boundary. See
// kidora-be/services/orderService.js for the mapping.
export type OrderStatus = "pending" | "success" | "rejected";
export type OrderStatusFilter = "all" | OrderStatus;

export type AdminOrder = {
    id: string;
    bookId: string;
    bookTitle: string | null;
    coverImageUrl: string | null;
    storyTheme: string | null;
    childName: string | null;
    status: string;
    total: number;
    placedAt: string;
    deliveredAt: string | null;
    hasReview: boolean;
    customerName: string | null;
    customerEmail: string | null;
};
