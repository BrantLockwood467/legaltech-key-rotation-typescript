export type MatterIntake = { matterId: string; clientName: string; receivedAt: string };
export type SignedDocumentDelivery = { matterId: string; documentName: string; signedUrl: string };
export type DeadlineFollowUp = { matterId: string; deadline: string; owner: string };

export function overlapHoursForRotation(graceHours: number): number {
  if (!Number.isInteger(graceHours) || graceHours < 1) {
    throw new Error("grace_hours must be a positive integer");
  }
  return graceHours;
}

export function legalTechMatter(): {
  intake: MatterIntake;
  document: SignedDocumentDelivery;
  followUp: DeadlineFollowUp;
} {
  return {
    intake: { matterId: "matter-104", clientName: "Northstar Legal", receivedAt: "2026-10-24T09:00:00Z" },
    document: { matterId: "matter-104", documentName: "engagement-letter.pdf", signedUrl: "https://documents.example/signed/matter-104" },
    followUp: { matterId: "matter-104", deadline: "2026-11-07", owner: "intake-team" }
  };
}
