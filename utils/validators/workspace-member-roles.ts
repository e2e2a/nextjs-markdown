export const MEMBER_ROLES = ['editor', 'owner', 'viewer'] as const;

export function isValidMemberRole(role: string): role is (typeof MEMBER_ROLES)[number] {
  return MEMBER_ROLES.includes(role as 'editor' | 'owner' | 'viewer');
}
