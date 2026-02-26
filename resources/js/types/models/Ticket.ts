import { User } from "..";
import { TicketPriority } from "../enums/TicketPriority";
import { TicketStatus } from "../enums/TicketStatus";
import { Category } from "./Category";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category: Category;
  user_id: number;
  user: User;
  assigned_to?: number | null;
  priority: TicketPriority;
  status: TicketStatus;
  attachments?: string[] | null;
  created_at: string;
  updated_at: string;
}
