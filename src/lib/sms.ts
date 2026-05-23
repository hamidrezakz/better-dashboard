import https from "node:https";

export type SmsSendResult = {
  ok: boolean;
  status?: string;
  recId?: number;
};

export type ProviderResponse = {
  recId?: number;
  status?: string;
};

export class SmsProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmsProviderError";
  }
}

class SmsService {
  private readonly apiToken: string | undefined;
  private readonly sharedBodyId: string | undefined;
  private readonly enabled: boolean;

  constructor() {
    this.apiToken = process.env.SMS_API_TOKEN;
    this.sharedBodyId = process.env.SMS_SHARED_BODY_ID_OTP;
    this.enabled = Boolean(this.apiToken);

    if (!this.enabled) {
      console.warn("SMS disabled: missing SMS_API_TOKEN environment variable");
    }
  }

  async sendSharedTemplate(
    phone: string,
    args: string[],
    bodyId?: string
  ): Promise<ProviderResponse> {
    if (!this.enabled || !this.apiToken) {
      return { status: "disabled" };
    }

    const resolvedBodyId = bodyId ?? this.sharedBodyId;
    if (!resolvedBodyId) {
      throw new Error("SMS shared template bodyId is not configured");
    }

    const numericBodyId = Number(resolvedBodyId);
    if (Number.isNaN(numericBodyId)) {
      throw new Error("SMS shared template bodyId must be numeric");
    }

    const payload = JSON.stringify({
      bodyId: numericBodyId,
      to: this.normalizeForProvider(phone),
      args,
    });

    const options: https.RequestOptions = {
      hostname: "console.melipayamak.com",
      port: 443,
      path: `/api/send/shared/${this.apiToken}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    return new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(chunk as Buffer));
        response.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          try {
            const parsed = JSON.parse(raw);
            if (!parsed?.recId) {
              console.error(
                "SMS shared template failed",
                JSON.stringify({
                  status: parsed?.status ?? "unknown",
                  bodyId: numericBodyId,
                })
              );
            }
            resolve(parsed);
          } catch (error) {
            console.error("SMS provider response parse error", error, raw);
            resolve({ status: "parse_error" });
          }
        });
      });

      request.on("error", (error) => {
        console.error("SMS provider request failed", error);
        reject(error);
      });

      request.write(payload);
      request.end();
    });
  }

  async sendSharedOtp(
    phone: string,
    code: string,
    bodyId?: string
  ): Promise<SmsSendResult> {
    try {
      const response = await this.sendSharedTemplate(phone, [code], bodyId);
      const ok = Boolean(response.recId);

      if (!ok) {
        const message = response.status || "sms_delivery_failed";
        console.error(`Shared OTP SMS failed for ${phone}: status=${message}`);
        throw new SmsProviderError(message);
      }

      console.info(`Shared OTP SMS sent to ${phone}: recId=${response.recId}`);

      return { ok, status: response.status, recId: response.recId };
    } catch (error) {
      if (error instanceof SmsProviderError) {
        throw error;
      }
      console.error("Shared OTP SMS threw", error);
      throw new SmsProviderError("request_error");
    }
  }

  private normalizeForProvider(raw: string): string {
    let phone = raw.trim().replace(/[-_\s]/g, "");
    if (phone.startsWith("+98")) {
      return `0${phone.slice(3)}`;
    }
    if (/^98\d{10}$/.test(phone)) {
      return `0${phone.slice(2)}`;
    }
    return phone;
  }
}

export const smsService = new SmsService();

// Test-only SMS service: logs OTPs instead of sending real SMS
class TestSmsService {
  async sendSharedOtp(phone: string, code: string): Promise<SmsSendResult> {
    console.info(`[TEST SMS] OTP for ${phone}: ${code}`);
    return { ok: true, status: "test", recId: 0 };
  }
}

export const testSmsService = new TestSmsService();
