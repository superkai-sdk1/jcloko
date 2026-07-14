/** Строит минимальный Lexical-стейт (richText) из простого текста. */
export const textToLexical = (text: string) => {
  const paragraphs = (text || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const children = (paragraphs.length ? paragraphs : ['']).map((p) => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: p, version: 1 },
    ],
  }))
  return {
    root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
  }
}
