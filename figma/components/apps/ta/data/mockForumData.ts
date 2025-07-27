export const mockQuestions = [
  {
    id: '1',
    title: '关于矩阵特征值计算的问题',
    content: '老师您好，我在计算3x3矩阵的特征值时遇到了困难，特别是在求解特征多项式时总是出错。请问有什么好的方法或技巧吗？具体的计算步骤能详细说明一下吗？\n\n我已经尝试了好几种方法，但是总是在某个步骤出现错误。希望能得到详细的指导。',
    student: {
      name: '张三',
      id: '2023001001'
    },
    course: '线性代数',
    knowledgePoint: '矩阵特征值',
    status: 'pending' as const,
    priority: 'high' as const,
    createdAt: '2025-07-23T09:30:00Z',
    replies: [
      {
        id: '1',
        content: '同学你好，计算特征值确实需要一些技巧。首先要注意特征多项式的展开，建议按第一行或第一列展开。\n\n具体步骤如下：\n1. 计算 det(A - λI)\n2. 展开特征多项式\n3. 求解方程的根\n\n你可以把具体的矩阵发出来，我帮你详细分析一下。',
        author: {
          name: '李助教',
          role: 'ta' as const
        },
        createdAt: '2025-07-23T10:15:00Z',
        likes: 3
      }
    ],
    likes: 5,
    views: 23,
    tags: ['特征值', '矩阵', '计算方法']
  },
  {
    id: '2',
    title: '积分运算中的换元法疑问',
    content: '在做积分题时，什么时候应该使用换元法？如何选择合适的换元变量？\n\n我经常在选择换元变量时感到困惑，有时候选错了会让计算变得更复杂。',
    student: {
      name: '李四',
      id: '2023001002'
    },
    course: '微积分基础',
    knowledgePoint: '积分方法',
    status: 'answered' as const,
    priority: 'medium' as const,
    createdAt: '2025-07-22T14:20:00Z',
    replies: [
      {
        id: '2',
        content: '换元法的核心是找到合适的替换变量来简化积分。一般来说，有以下几种情况：\n\n1. 当被积函数包含 √(a²-x²) 时，可用 x = a sin t\n2. 当被积函数包含 √(x²+a²) 时，可用 x = a tan t\n3. 当被积函数包含 √(x²-a²) 时，可用 x = a sec t\n\n选择的原则是让根号内的表达式变成完全平方。',
        author: {
          name: '王助教',
          role: 'ta' as const
        },
        createdAt: '2025-07-22T15:00:00Z',
        likes: 8,
        isAccepted: true
      },
      {
        id: '3',
        content: '谢谢老师的解答，我明白了！原来有这些固定的模式，我之前都是瞎试的。',
        author: {
          name: '李四',
          role: 'student' as const
        },
        createdAt: '2025-07-22T15:30:00Z',
        likes: 1
      }
    ],
    likes: 12,
    views: 45,
    tags: ['积分', '换元法', '微积分']
  },
  {
    id: '3',
    title: '极限计算的洛必达法则应用',
    content: '请问洛必达法则在什么情况下可以使用？有哪些注意事项？\n\n我知道是用于未定式，但是具体什么情况下才能用，什么情况下不能用？',
    student: {
      name: '王五',
      id: '2023001003'
    },
    course: '高等数学',
    knowledgePoint: '极限与连续',
    status: 'resolved' as const,
    priority: 'low' as const,
    createdAt: '2025-07-21T11:45:00Z',
    replies: [
      {
        id: '4',
        content: '洛必达法则适用于0/0型和∞/∞型未定式。\n\n使用条件：\n1. lim f(x) = 0 且 lim g(x) = 0，或都等于∞\n2. f\'(x) 和 g\'(x) 在某个邻域内存在\n3. lim f\'(x)/g\'(x) 存在或为无穷大\n\n注意事项：\n- 只能用于未定式\n- 可能需要多次使用\n- 有时候用其他方法更简单',
        author: {
          name: '陈助教',
          role: 'ta' as const
        },
        createdAt: '2025-07-21T12:20:00Z',
        likes: 15,
        isAccepted: true
      }
    ],
    likes: 8,
    views: 67,
    tags: ['极限', '洛必达法则', '未定式']
  }
];