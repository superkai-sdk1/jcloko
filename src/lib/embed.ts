/** Преобразует ссылку YouTube/RuTube/VK в embed-URL для iframe. */
export const toEmbedUrl = (provider: string | undefined | null, url: string): string => {
  try {
    if (provider === 'youtube' || /youtu/.test(url)) {
      const id =
        url.match(/[?&]v=([^&]+)/)?.[1] ||
        url.match(/youtu\.be\/([^?]+)/)?.[1] ||
        url.match(/embed\/([^?]+)/)?.[1]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : url
    }
    if (provider === 'rutube' || /rutube/.test(url)) {
      const id = url.match(/rutube\.ru\/video\/([^/?]+)/)?.[1]
      return id ? `https://rutube.ru/play/embed/${id}` : url
    }
    if (provider === 'vk' || /vk\.com|vkvideo/.test(url)) {
      // ВК-плеер обычно уже даёт готовый embed; отдаём как есть
      return url
    }
    return url
  } catch {
    return url
  }
}
