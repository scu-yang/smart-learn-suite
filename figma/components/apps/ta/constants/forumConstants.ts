export const STATUS_CONFIG = {
  pending: {
    color: 'bg-red-100 text-red-800',
    text: '待回复'
  },
  answered: {
    color: 'bg-blue-100 text-blue-800',
    text: '已回复'
  },
  resolved: {
    color: 'bg-green-100 text-green-800',
    text: '已解决'
  }
} as const;

export const PRIORITY_CONFIG = {
  high: {
    color: 'bg-red-100 text-red-800',
    text: '高优先级'
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800',
    text: '中优先级'
  },
  low: {
    color: 'bg-green-100 text-green-800',
    text: '低优先级'
  }
} as const;

export const ROLE_CONFIG = {
  student: {
    label: '学生',
    color: 'bg-blue-100 text-blue-800'
  },
  ta: {
    label: '助教',
    color: 'bg-purple-100 text-purple-800'
  },
  teacher: {
    label: '教师',
    color: 'bg-green-100 text-green-800'
  }
} as const;