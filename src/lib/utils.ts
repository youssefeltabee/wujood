export function cn(...classes: (string | boolean | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(" ");
}
