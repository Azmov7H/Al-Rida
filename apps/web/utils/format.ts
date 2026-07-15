export function formatOrderNumber(input: string): string {
  return input.toUpperCase()
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}
