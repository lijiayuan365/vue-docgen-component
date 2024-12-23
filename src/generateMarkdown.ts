import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { ComponentDoc, ParamTag } from 'vue-docgen-api'

/**
 * 生成 markdown 数据
 * @param { ComponentDoc } componentInfo - 组件信息
 * @returns { string } - markdown 数据
 */
function generateVueDocData(componentInfo: ComponentDoc): string {
    let md = '';

    // Props 文档
    if (componentInfo.props && componentInfo.props.length > 0) {
        md += '## Props\n\n';
        md += '| name  | type | default | values | description |\n';
        md += '| ---- | ---- | ---- | ------ | ------ |\n';

        componentInfo.props.forEach(prop => {
            const defaultValue = prop.defaultValue
                ? prop.defaultValue.value
                : '-';
            md += `| ${prop.name} | ${prop.type?.name || ''} | ${defaultValue} | ${prop.values?.join(', ') || ''} | ${prop.description || '-'} |\n`;
        });
        md += '\n';
    }

    // Events 文档
    if (componentInfo.events && componentInfo.events.length > 0) {
        md += '## Events\n\n';
        md += '| name  | param | description|\n';
        md += '| -------- | ---- | ---- |\n';

        componentInfo.events.forEach(event => {
            const params = event.properties
                ? `${event.properties.map(p => `${p.name}: ${p.type.names.join('|')}`).join(', ')}`
                : '';
            md += `| ${event.name} | (${params}) | ${event.description || ''} |\n`;
        });
        md += '\n';
    }
    // Methods/Expose 文档
    if (componentInfo.expose && componentInfo.expose.length > 0) {
        md += '## Expose\n\n';
        md += '| name | type | param | description  |\n';
        md += '| ------ | ---- | ---- | ---- |\n';

        componentInfo.expose.forEach(method => {
            const params = method.tags
                ? method.tags
                    .filter(tag => tag.title === 'param')
                    .map(tag => {
                        const paramTag = tag as ParamTag;
                        return `${paramTag.name}: ${paramTag.type?.name || ''}`;
                    })
                    .join(',  ')
                : '-';
            const typeTag = (method.tags || []).find(tag => tag.title === 'type');
            const type = typeTag && 'type' in typeTag ? typeTag.type?.name || '-' : '-';
            md += `| ${method.name} | ${type} | (${params}) | ${method.description || '-'} |\n`;
        });
        md += '\n';
    }

    // Slots 文档
    if (componentInfo.slots && componentInfo.slots.length > 0) {
        md += '## Slots\n\n';
        md += '| name | param  | description|\n';
        md += '| ---- | ---- | ---- |\n';
        componentInfo.slots.forEach(slot => {
            const bindings = slot.bindings
            ? slot.bindings.map(binding => `${binding.name}: ${binding.type?.name || ''}`).join(',  ')
            : '';
            md += `| ${slot.name} | (${bindings}) | ${slot.description || ''} |\n`;
        });
        md += '\n';
    }
    return md;
}

/**
 * 生成 markdown 文件
 * @param { ComponentDoc } componentInfo - 组件信息
 * @param { string } outputPath - 输出路径
 */
export function generateMarkdown(componentInfo: ComponentDoc, outputPath: string): void {
    try {
        const markdown = generateVueDocData(componentInfo);
        const wrappedMarkdown = `<!-- vue-docgen-start -->\n${markdown}<!-- vue-docgen-end -->`;

        let finalContent = '';

        try {
            // 尝试读取现有文件
            const existingContent = readFileSync(outputPath, 'utf8');
            const autoStartIndex = existingContent.indexOf('<!-- vue-docgen-start -->');
            const autoEndIndex = existingContent.indexOf('<!-- vue-docgen-end -->');

            if (autoStartIndex !== -1 && autoEndIndex !== -1) {
                // 如果存在标记，替换标记之间的内容
                finalContent = existingContent.substring(0, autoStartIndex) +
                    wrappedMarkdown +
                    existingContent.substring(autoEndIndex + '<!-- vue-docgen-end -->'.length);
            } else {
                // 如果没有标记，追加到文件末尾
                finalContent = existingContent + '\n\n' + wrappedMarkdown;
            }
        } catch (err) {
            // 如果文件不存在，直接使用新内容
            finalContent = wrappedMarkdown;
        }
        // Create parent directory if it doesn't exist
        const parentDir = path.dirname(outputPath);
        if (!existsSync(parentDir)) {
            mkdirSync(parentDir, { recursive: true });
        }
        writeFileSync(outputPath, finalContent, 'utf8');

    } catch (error) {
        console.error('转换过程中发生错误:', error);
    }
}