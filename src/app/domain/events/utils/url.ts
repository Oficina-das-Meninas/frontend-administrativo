export class UrlUtils {
  static addHttpsPrefix(url: string): string {
    if (!url) {
      return url;
    }

    url = url.trim();

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `https://${url}`;
  }

  static removeHttpPrefix(url: string): string {
    if (!url) {
      return url;
    }

    url = url.replace(/^https?:\/\//i, '');
    url = url.replace(/^www\.www\./i, 'www.');

    return url;
  }
}
