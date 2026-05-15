export type NotificationType =
  | 'expense_due'
  | 'income_pending'
  | 'monthly_summary'
  | 'negative_balance';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
};
