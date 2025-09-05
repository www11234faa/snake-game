/**
 * 学生信息管理系统
 * 功能：学生信息的增删改查操作
 * @author AI Assistant
 * @version 1.0.0
 */

// 学生接口定义
class Student {
  constructor(name, studentId, age, major) {
    this.name = name;
    this.studentId = studentId;
    this.age = age;
    this.major = major;
  }

  toString() {
    return `姓名: ${this.name}, 学号: ${this.studentId}, 年龄: ${this.age}, 专业: ${this.major}`;
  }
}

// 学生管理系统类
class StudentManager {
  constructor() {
    this.students = []; // 内存存储学生信息
  }

  /**
   * 添加学生信息
   * @param {string} name - 学生姓名
   * @param {string} studentId - 学号
   * @param {number} age - 年龄
   * @param {string} major - 专业
   * @returns {Object} 操作结果
   */
  addStudent(name, studentId, age, major) {
    // 参数验证
    if (!name || !studentId || !age || !major) {
      return { success: false, message: '所有字段都是必填的' };
    }

    if (this.students.find(s => s.studentId === studentId)) {
      return { success: false, message: `学号 ${studentId} 已存在` };
    }

    if (age < 0 || age > 100) {
      return { success: false, message: '年龄必须在0-100之间' };
    }

    const student = new Student(name, studentId, age, major);
    this.students.push(student);
    return { success: true, message: `学生 ${name} 添加成功`, student };
  }

  /**
   * 根据学号查询学生信息
   * @param {string} studentId - 学号
   * @returns {Object} 查询结果
   */
  getStudent(studentId) {
    const student = this.students.find(s => s.studentId === studentId);
    if (!student) {
      return { success: false, message: `未找到学号为 ${studentId} 的学生` };
    }
    return { success: true, message: '查询成功', student };
  }

  /**
   * 根据学号修改学生信息
   * @param {string} studentId - 学号
   * @param {Object} updates - 要更新的字段
   * @returns {Object} 操作结果
   */
  updateStudent(studentId, updates) {
    const studentIndex = this.students.findIndex(s => s.studentId === studentId);
    if (studentIndex === -1) {
      return { success: false, message: `未找到学号为 ${studentId} 的学生` };
    }

    const student = this.students[studentIndex];
    let updated = false;

    // 只允许修改年龄和专业
    if (updates.age !== undefined) {
      if (updates.age < 0 || updates.age > 100) {
        return { success: false, message: '年龄必须在0-100之间' };
      }
      student.age = updates.age;
      updated = true;
    }

    if (updates.major !== undefined) {
      student.major = updates.major;
      updated = true;
    }

    if (!updated) {
      return { success: false, message: '没有提供要修改的字段' };
    }

    return { success: true, message: '学生信息更新成功', student };
  }

  /**
   * 根据学号删除学生信息
   * @param {string} studentId - 学号
   * @returns {Object} 操作结果
   */
  deleteStudent(studentId) {
    const studentIndex = this.students.findIndex(s => s.studentId === studentId);
    if (studentIndex === -1) {
      return { success: false, message: `未找到学号为 ${studentId} 的学生` };
    }

    const deletedStudent = this.students.splice(studentIndex, 1)[0];
    return { success: true, message: `学生 ${deletedStudent.name} 删除成功`, student: deletedStudent };
  }

  /**
   * 获取所有学生信息
   * @returns {Array} 所有学生列表
   */
  getAllStudents() {
    return this.students;
  }

  /**
   * 显示所有学生信息
   */
  displayAllStudents() {
    if (this.students.length === 0) {
      console.log('当前没有学生信息');
      return;
    }

    console.log('\n=== 所有学生信息 ===');
    this.students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.toString()}`);
    });
    console.log(`总计: ${this.students.length} 名学生\n`);
  }
}

// 系统菜单和交互
class StudentSystem {
  constructor() {
    this.manager = new StudentManager();
  }

  /**
   * 显示系统菜单
   */
  showMenu() {
    console.log('\n=== 学生信息管理系统 ===');
    console.log('1. 添加学生信息');
    console.log('2. 查询学生信息');
    console.log('3. 修改学生信息');
    console.log('4. 删除学生信息');
    console.log('5. 显示所有学生');
    console.log('6. 退出系统');
    console.log('====================');
  }

  /**
   * 处理用户选择
   * @param {string} choice 用户选择
   */
  async handleChoice(choice) {
    switch (choice) {
      case '1':
        await this.addStudentFlow();
        break;
      case '2':
        await this.queryStudentFlow();
        break;
      case '3':
        await this.updateStudentFlow();
        break;
      case '4':
        await this.deleteStudentFlow();
        break;
      case '5':
        this.manager.displayAllStudents();
        break;
      case '6':
        console.log('感谢使用，再见！');
        process.exit(0);
        break;
      default:
        console.log('无效的选择，请重新输入！');
    }
  }

  /**
   * 添加学生流程
   */
  async addStudentFlow() {
    console.log('\n--- 添加学生信息 ---');
    
    // 模拟用户输入（实际使用readline）
    const testData = {
      name: '张三',
      studentId: '2024001',
      age: 20,
      major: '计算机科学'
    };
    
    console.log(`测试数据: ${JSON.stringify(testData)}`);
    const result = this.manager.addStudent(testData.name, testData.studentId, testData.age, testData.major);
    console.log(result.message);
  }

  /**
   * 查询学生流程
   */
  async queryStudentFlow() {
    console.log('\n--- 查询学生信息 ---');
    
    const studentId = '2024001'; // 测试数据
    console.log(`查询学号: ${studentId}`);
    
    const result = this.manager.getStudent(studentId);
    console.log(result.message);
    if (result.student) {
      console.log(`学生详情: ${result.student.toString()}`);
    }
  }

  /**
   * 修改学生信息流程
   */
  async updateStudentFlow() {
    console.log('\n--- 修改学生信息 ---');
    
    const studentId = '2024001';
    const updates = {
      age: 21,
      major: '软件工程'
    };
    
    console.log(`修改学号 ${studentId} 的信息: ${JSON.stringify(updates)}`);
    
    const result = this.manager.updateStudent(studentId, updates);
    console.log(result.message);
    if (result.student) {
      console.log(`更新后: ${result.student.toString()}`);
    }
  }

  /**
   * 删除学生流程
   */
  async deleteStudentFlow() {
    console.log('\n--- 删除学生信息 ---');
    
    const studentId = '2024001';
    console.log(`删除学号: ${studentId}`);
    
    const result = this.manager.deleteStudent(studentId);
    console.log(result.message);
    if (result.student) {
      console.log(`被删除学生: ${result.student.toString()}`);
    }
  }

  /**
   * 运行演示测试
   */
  async runDemo() {
    console.log('🎓 学生信息管理系统演示开始\n');
    
    // 演示完整流程
    console.log('1️⃣ 添加学生...');
    await this.addStudentFlow();
    
    console.log('2️⃣ 查询学生...');
    await this.queryStudentFlow();
    
    console.log('3️⃣ 修改学生信息...');
    await this.updateStudentFlow();
    
    console.log('4️⃣ 显示所有学生...');
    this.manager.displayAllStudents();
    
    console.log('5️⃣ 删除学生...');
    await this.deleteStudentFlow();
    
    console.log('6️⃣ 验证删除结果...');
    this.manager.displayAllStudents();
    
    console.log('\n✅ 演示完成！');
  }
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  const system = new StudentSystem();
  system.runDemo().catch(console.error);
}

module.exports = { Student, StudentManager, StudentSystem };