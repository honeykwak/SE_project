export interface Inquiry {
  _id: string;
  user: string;
  senderName: string;
  senderEmail: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryData {
  senderName: string;
  senderEmail: string;
  message: string;
}

