/** Slug-ify an Arabic/English title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\u0600-\u06FF\u0020-\u007E]/g, "-") // keep arabic + ascii
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "link"
}
