export type TriggerConfig = {
  triggerType: "event" | "schedule" | "manual";
  eventName?: string;
  schedule?: { cron?: string; at?: string; timezone?: string };
};

export type AudienceConfig = {
  audienceType: "all" | "list";
  listId?: string;
};

export type SmsConfig = {
  senderId?: string;
  text?: string;
};

export type WhatsAppConfig = {
  templateId?: string;
  variables?: Record<string, string>;
};

export type DelayConfig = {
  minutes?: number;
};

export type ConditionConfig = {
  field?: string;
  operator?: "equals" | "not_equals" | "greater_than" | "less_than";
  value?: string;
};

export function defaultConfigByType(type?: string) {
  switch (type) {
    case "trigger":
      return { triggerType: "event", eventName: "" } as TriggerConfig;
    case "audience":
      return { audienceType: "all" } as AudienceConfig;
    case "sms":
      return { senderId: "", text: "" } as SmsConfig;
    case "whatsapp":
      return { templateId: "", variables: {} } as WhatsAppConfig;
    case "delay":
      return { minutes: 10 } as DelayConfig;
    case "condition":
      return {
        field: "", // event.payload.amount
        operator: "equals",
        value: "",
      } as ConditionConfig;
    default:
      return {};
  }
}
