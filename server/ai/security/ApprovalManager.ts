// ============================================================================
// SARVAGYA AI — APPROVAL MANAGER & AUDIT LOGGER (`server/ai/security/ApprovalManager.ts`)
// Controls sensitive operations, booking authorizations, and immutable audit logs
// ============================================================================

import fs from "fs";
import path from "path";

export interface ApprovalRequest {
  approvalId: string;
  actionType: "BOOKING_AND_PAYMENT" | "FILE_WRITE" | "EXTERNAL_COMMUNICATION" | "SYSTEM_RECONFIGURATION";
  title: string;
  description: string;
  payload: any;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requiresAdultAuthorization: boolean;
  requestedBy: string; // e.g. "Astra Engine" or "Agent OS"
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  initiator: string;
  action: string;
  modelUsed: string;
  toolsInvoked: string[];
  approvalGranted: boolean;
  success: boolean;
  details: string;
}

export class ApprovalManager {
  private approvals = new Map<string, ApprovalRequest>();
  private auditLogs: AuditRecord[] = [];
  private dataDir = path.resolve("data");
  private auditPath: string;

  constructor() {
    if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
    this.auditPath = path.join(this.dataDir, "sarvagya_audit_log.json");
    this.loadLogs();
  }

  private loadLogs(): void {
    if (!fs.existsSync(this.auditPath)) return;
    try {
      this.auditLogs = JSON.parse(fs.readFileSync(this.auditPath, "utf-8"));
    } catch (err) {
      console.warn("[AuditLogger] Failed to read audit log:", err);
    }
  }

  private saveLogs(): void {
    try {
      fs.writeFileSync(this.auditPath, JSON.stringify(this.auditLogs, null, 2));
    } catch (err) {
      console.warn("[AuditLogger] Failed to write audit log:", err);
    }
  }

  public createApprovalRequest(data: Omit<ApprovalRequest, "approvalId" | "status" | "createdAt">): ApprovalRequest {
    const approvalId = `appr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const req: ApprovalRequest = {
      ...data,
      approvalId,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    this.approvals.set(approvalId, req);

    this.logAction({
      initiator: data.requestedBy,
      action: `APPROVAL_REQUESTED_${data.actionType}`,
      modelUsed: "sarvagya-security-controller",
      toolsInvoked: [],
      approvalGranted: false,
      success: true,
      details: `Approval requested: ${data.title}. Adult authorization: ${data.requiresAdultAuthorization}`,
    });

    return req;
  }

  public getApproval(approvalId: string): ApprovalRequest | undefined {
    return this.approvals.get(approvalId);
  }

  public listPending(): ApprovalRequest[] {
    return Array.from(this.approvals.values()).filter((a) => a.status === "PENDING");
  }

  public resolveApproval(approvalId: string, approved: boolean, authorizedBy: string = "Commander"): ApprovalRequest | null {
    const req = this.approvals.get(approvalId);
    if (!req) return null;

    req.status = approved ? "APPROVED" : "REJECTED";
    req.resolvedAt = new Date().toISOString();
    req.resolvedBy = authorizedBy;

    this.logAction({
      initiator: authorizedBy,
      action: approved ? "APPROVAL_GRANTED" : "APPROVAL_REJECTED",
      modelUsed: "human_guardian_controller",
      toolsInvoked: [],
      approvalGranted: approved,
      success: true,
      details: `Action ${req.title} was ${approved ? "APPROVED" : "REJECTED"} by ${authorizedBy}`,
    });

    return req;
  }

  public logAction(record: Omit<AuditRecord, "id" | "timestamp">): void {
    const log: AuditRecord = {
      ...record,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    this.saveLogs();
  }

  public getRecentLogs(limit: number = 25): AuditRecord[] {
    return this.auditLogs.slice(0, limit);
  }
}

export const approvalManager = new ApprovalManager();
