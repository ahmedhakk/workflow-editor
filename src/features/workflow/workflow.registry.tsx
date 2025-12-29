import React from "react";
import {
  Zap,
  Users,
  MessageCircle,
  MessageSquareText,
  Clock,
  GitBranch,
  Bell,
} from "lucide-react";

export type WorkflowNodeType =
  | "trigger"
  | "audience"
  | "sms"
  | "whatsapp"
  | "delay"
  | "condition"
  | "notification";
export type NodeVariant =
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "gray"
  | "yellow"
  | "red";

export const WORKFLOW_NODE_REGISTRY: Record<
  WorkflowNodeType,
  {
    label: string;
    variant: NodeVariant;
    icon: React.ReactNode;
    tooltip: string;
  }
> = {
  trigger: {
    label: "Trigger",
    variant: "purple",
    icon: <Zap className="h-4 w-4" />,
    tooltip: "Starts the workflow (Webhook / Schedule / Manual).",
  },
  audience: {
    label: "Audience",
    variant: "blue",
    icon: <Users className="h-4 w-4" />,
    tooltip: "Choose who will receive messages.",
  },
  whatsapp: {
    label: "Send WhatsApp",
    variant: "green",
    icon: <MessageCircle className="h-4 w-4" />,
    tooltip: "Send a WhatsApp template message.",
  },
  sms: {
    label: "Send SMS",
    variant: "orange",
    icon: <MessageSquareText className="h-4 w-4" />,
    tooltip: "Send an SMS message.",
  },
  delay: {
    label: "Delay",
    variant: "gray",
    icon: <Clock className="h-4 w-4" />,
    tooltip: "Wait before running the next step.",
  },
  condition: {
    label: "IF / ELSE",
    variant: "red",
    icon: <GitBranch className="h-4 w-4" />,
    tooltip: "Branch the workflow based on a rule.",
  },
  notification: {
    label: "Send Notification",
    variant: "yellow",
    icon: <Bell className="h-4 w-4" />,
    tooltip: "Send an in-app notification.",
  },
};
