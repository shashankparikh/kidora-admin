export type ReviewStatus = "pending" | "approved" | "rejected";
export type ReviewStatusFilter = "all" | ReviewStatus;

export type AdminReview = {
    id: string;
    orderId: string;
    rating: number;
    title: string | null;
    comment: string | null;
    childName: string | null;
    storyTheme: string | null;
    status: ReviewStatus;
    author: string;
    authorEmail?: string;
    createdAt: string;
};
