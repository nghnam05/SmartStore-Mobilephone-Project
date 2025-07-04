import crypto from "crypto";

export function createMomoSignature(
  secretKey: string,
  rawData: string
): string {
  return crypto.createHmac("sha256", secretKey).update(rawData).digest("hex");
}

export const momoConfig = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  redirectUrl: "https://428d-171-224-240-187.ngrok-free.app/thanks",
  ipnUrl: "https://428d-171-224-240-187.ngrok-free.app/payment/ipn",
};
