export function hintFor(
  messageKey: string,
  t: (key: string) => string
): string {
  const m = messageKey.toLowerCase();

  if (m.includes("trigger") && m.includes("only one"))
    return t("hints.deleteExtraTrigger");
  if (m.includes("workflow must have a trigger")) return t("hints.dragTrigger");
  if (m.includes("trigger") && m.includes("incoming"))
    return t("hints.removeIncomingEdge");
  if (m.includes("not reachable")) return t("hints.connectToFlow");
  if (m.includes("if branch") && m.includes("not connected"))
    return t("hints.connectIfBranch");
  if (m.includes("else branch") && m.includes("not connected"))
    return t("hints.connectElseBranch");
  if (m.includes("sms") && m.includes("message"))
    return t("hints.fillSmsMessage");
  if (m.includes("whatsapp") && m.includes("template"))
    return t("hints.setTemplateId");
  if (m.includes("audience") && m.includes("listid"))
    return t("hints.fillListId");
  if (m.includes("delay") && m.includes("minutes"))
    return t("hints.setDelayMinutes");
  if (m.includes("notification") && (m.includes("title") || m.includes("body")))
    return t("hints.fillNotification");
  if (m.includes("cycle")) return t("hints.removeCycle");

  return "";
}
