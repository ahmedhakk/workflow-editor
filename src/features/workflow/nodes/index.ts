import TriggerNode from "./TriggerNode";
import AudienceNode from "./AudienceNode";
import SmsNode from "./SmsNode";
import WhatsAppNode from "./WhatsAppNode";
import DelayNode from "./DelayNode";
import ConditionNode from "./ConditionNode";

export const nodeTypes = {
  trigger: TriggerNode,
  audience: AudienceNode,
  sms: SmsNode,
  whatsapp: WhatsAppNode,
  delay: DelayNode,
  condition: ConditionNode,
};
