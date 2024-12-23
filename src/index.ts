import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { parse } from 'vue-docgen-api';

import { generateMarkdown } from './generateMarkdown';
import { awaitTo, isGlobMatch, readConfig } from './utils';


interface BuildOptions {
  flat?: boolean; // 是否使用扁平化输出结构
}

interface Config {
  include: string[]; // 需要包含的文件匹配模式
  exclude: string[]; // 需要排除的文件匹配模式
  inputDir: string; // 输入目录路径
  outputDir: string; // 输出目录路径
  options: BuildOptions;
}

const defaultConfig: Config = {
  include: [],
  exclude: [],
  inputDir: 'components',
  outputDir: 'docs',
  options: {
    flat: false,
  },
};
const customConfig = readConfig();
const { inputDir = 'components', outputDir = 'docs', include = [], exclude = [], options: buildOptions = {} } = {
  ...defaultConfig,
  ...customConfig,
};

interface VueFileInfo {
  fullPath: string; // 文件完整路径
  componentName: string; // 组件名称
  parentPath: string; // 父目录路径
}

async function getAllVueFiles(
  dir: string,
  baseDir: string = dir,
  outputDir: string
): Promise<VueFileInfo[]> {
  // 排除 node_modules 目录
  if (dir.includes('node_modules')) {
    return [];
  }
  const files = readdirSync(dir);
  let vueFiles: VueFileInfo[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      // 如果是目录，递归处理
      const relativeDir = path.relative(baseDir, fullPath);
      const outputSubDir = path.join(outputDir, relativeDir);
      vueFiles = vueFiles.concat(await getAllVueFiles(fullPath, baseDir, outputSubDir));
    } else if (file.endsWith('.vue')) {
      // 检查文件是否匹配包含/排除规则
      if (!await isGlobMatch(fullPath, include, exclude)) {
        continue;
      }
      const componentName = path.basename(fullPath, '.vue');
      const parentPath = path.dirname(fullPath);
      vueFiles.push({
        fullPath,
        componentName,
        parentPath
      });
    }
  }
  return vueFiles;
}

export async function vueDocgenComponent(): Promise<void> {
  const { flat = false } = buildOptions;
  // 确保输出目录存在
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // 获取所有 Vue 文件并生成文档
  const vueFiles = await getAllVueFiles(inputDir, inputDir, outputDir);
  for (const file of vueFiles) {
    // 根据是否扁平化决定输出路径
    const outputPath = flat ? outputDir : path.join(outputDir, path.relative(inputDir, file.parentPath));
    const outputFile = path.join(outputPath, `${file.componentName}.md`);
    // 解析组件信息
    const [err, componentInfo] = await awaitTo(parse(file.fullPath));
    if (err) {
      console.error(`componet ${file.componentName} errpr:`, err);
      continue;
    }
    generateMarkdown(componentInfo, outputFile);
  }
}

vueDocgenComponent().catch((error) => {
  console.error('vue-docgen-component error:', error);
  process.exit(1);
});

