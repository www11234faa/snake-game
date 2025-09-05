// Node.js 函数：筛选大于10的数字
// 作者：AI助手
// 日期：2024

/**
 * 从数组中筛选出大于10的数字
 * @param {Array} numbers - 数字数组
 * @returns {Array} - 大于10的数字数组
 */
function filterGreaterThanTen(numbers) {
    return numbers.filter(num => num > 10);
}

// 测试数组
const testArray = [5, 12, 8, 15, 3, 20];

// 执行筛选
const filteredNumbers = filterGreaterThanTen(testArray);

// 输出结果
console.log('原始数组:', testArray);
console.log('筛选结果（大于10的数字）:', filteredNumbers);
console.log('筛选数量:', filteredNumbers.length);

// 额外功能：展示筛选过程
console.log('\n--- 筛选过程 ---');
testArray.forEach((num, index) => {
    const status = num > 10 ? '✅ 保留' : '❌ 过滤';
    console.log(`索引 ${index}: ${num} ${status}`);
});

// 导出函数（供其他模块使用）
module.exports = { filterGreaterThanTen };