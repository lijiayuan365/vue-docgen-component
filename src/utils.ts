import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'tinyglobby';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function awaitTo<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}
export function readConfig(): Record<string, any> {
  // 获取当前项目根目录
  const currentDir = process.cwd();
  const rootConfigPath = path.join(currentDir, 'vue-doc.json');
  if (existsSync(rootConfigPath)) {
    const configContent = readFileSync(rootConfigPath, 'utf-8');
    return JSON.parse(configContent);
  }
  return {};
}

// glob 匹配结果缓存
const globCache: Map<string, string[]> = new Map();

/**
 * 获取 glob 匹配结果，带缓存
 * @param {string} pattern - glob 模式
 * @returns {string[]} 匹配的文件列表
 */
function getCachedGlobResult(pattern: string): string[] {
  if (pattern.includes('node_modules')) {
    return [];
  }
  if (!globCache.has(pattern)) {
    const matches = globSync(pattern);
    globCache.set(pattern, matches);
  }
  return globCache.get(pattern) || [];
}

/**
 * 判断文件是否匹配 include 或 exclude 规则
 * @param {string} filePath - 文件路径
 * @param {string[]} include - include 规则
 * @param {string[]} exclude - exclude 规则
 * @returns {boolean} 是否匹配
 */
export function isGlobMatch(
  filePath: string,
  include: string[] = [],
  exclude: string[] = []
): boolean {
  if (include.length === 0 && exclude.length === 0) {
    return true;
  }

  // 检查 include 匹配
  const matchesInclude = include.length === 0 || include.some(pattern => {
    const matches = getCachedGlobResult(pattern);
    return matches.includes(filePath);
  });

  if (!matchesInclude) {
    return false;
  }

  // 检查 exclude 匹配
  const matchesExclude = exclude.some(pattern => {
    const matches = getCachedGlobResult(pattern);
    return matches.includes(filePath);
  });

  return matchesInclude && !matchesExclude;
}
