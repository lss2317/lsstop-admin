import emojiFileMap from './emoji-file-map.json';

/**
 * COS 表情资源访问地址
 */
const EMOJI_BASE_URL = (
  import.meta.env.VITE_EMOJI_BASE_URL ||
  'https://blog-1307541812.cos.ap-shanghai.myqcloud.com/blog/emoji'
).replace(/\/+$/, '');

/**
 * 新表情文本标记与 COS 文件地址映射
 */
const EmojiList = Object.fromEntries(
  Object.entries(emojiFileMap).map(([token, fileName]) => [token, `${EMOJI_BASE_URL}/${fileName}`])
) as Record<string, string>;

export default EmojiList;
