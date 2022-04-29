type R = Record<string, unknown>;

export const isPureText = (content: R | R[] | undefined | null): boolean => {
  if (!content) return false;
  if (Array.isArray(content)) {
    if (content.length > 1) return false;
    return isPureText(content[0]);
  }

  const child = content['content'];
  if (child) {
    return isPureText(child as R[]);
  }

  return content['type'] === 'text';
};
