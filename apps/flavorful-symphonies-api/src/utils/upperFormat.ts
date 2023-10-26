export default function upperFormat(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .map((s) => s.toUpperCase())
    .join('_');
}
