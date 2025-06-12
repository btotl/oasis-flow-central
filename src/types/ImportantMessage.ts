
export interface ImportantMessage {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  acknowledgedBy: Array<{
    employeeName: string;
    acknowledgedAt: Date;
  }>;
}
