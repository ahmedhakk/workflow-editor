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
    labelKey: string;
    tooltipKey: string;
    variant: NodeVariant;
    icon: React.ReactNode;
  }
> = {
  trigger: {
    labelKey: "nodeLabels.trigger",
    tooltipKey: "nodeTooltips.trigger",
    variant: "purple",
    icon: <Zap className="h-4 w-4" />,
  },
  audience: {
    labelKey: "nodeLabels.audience",
    tooltipKey: "nodeTooltips.audience",
    variant: "blue",
    icon: <Users className="h-4 w-4" />,
  },
  whatsapp: {
    labelKey: "nodeLabels.whatsapp",
    tooltipKey: "nodeTooltips.whatsapp",
    variant: "green",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  sms: {
    labelKey: "nodeLabels.sms",
    tooltipKey: "nodeTooltips.sms",
    variant: "orange",
    icon: <MessageSquareText className="h-4 w-4" />,
  },
  delay: {
    labelKey: "nodeLabels.delay",
    tooltipKey: "nodeTooltips.delay",
    variant: "gray",
    icon: <Clock className="h-4 w-4" />,
  },
  condition: {
    labelKey: "nodeLabels.condition",
    tooltipKey: "nodeTooltips.condition",
    variant: "red",
    icon: <GitBranch className="h-4 w-4" />,
  },
  notification: {
    labelKey: "nodeLabels.notification",
    tooltipKey: "nodeTooltips.notification",
    variant: "yellow",
    icon: <Bell className="h-4 w-4" />,
  },
};
