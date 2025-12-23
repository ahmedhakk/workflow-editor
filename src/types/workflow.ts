export type Workflow = {
  id: string;
  name: string;
  status: "draft" | "published";
  nodes: Array<{
    id: string;
    type: "trigger" | "audience" | "sms" | "whatsapp" | "delay";
    position: { x: number; y: number };
    data: Record<string, any>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
};
