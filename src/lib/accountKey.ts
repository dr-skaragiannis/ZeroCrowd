export const ACCOUNT_KEY_FORMAT = "gamehack-account-key" as const;

export type AccountRecoveryFile = {
  format: typeof ACCOUNT_KEY_FORMAT;
  version: 1;
  accountId: string;
  handle: string;
  displayName: string;
  key: string;
  createdAt: string;
};
