import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '@/hooks/useAuth';

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RolePermissions {
  // 基础学习功能
  courses: Permission;
  exams: Permission;
  practice: Permission;
  errorBook: Permission;
  
  // 教学功能
  classManagement: Permission;
  examManagement: Permission;
  gradingCenter: Permission;
  questionBank: Permission;
  
  // 报告和分析
  analyticsReport: Permission;
  learningReport: Permission;
  
  // 交流功能
  qaForum: Permission;
  notificationManagement: Permission;
  
  // 管理功能
  userManagement: Permission;
  systemSettings: Permission;
  systemMonitor: Permission;
  auditLogs: Permission;
  
  // 学校管理功能
  schoolDataManagement: Permission;
  teacherManagement: Permission;
  courseApproval: Permission;
}

export interface PermissionContextType {
  permissions: RolePermissions;
  userRole: UserRole;
  hasPermission: (module: keyof RolePermissions, action: keyof Permission) => boolean;
  hasModuleAccess: (module: keyof RolePermissions) => boolean;
}

// 默认权限模板
const defaultPermission: Permission = { view: false, create: false, edit: false, delete: false };
const readOnlyPermission: Permission = { view: true, create: false, edit: false, delete: false };
const fullPermission: Permission = { view: true, create: true, edit: true, delete: true };
const limitedEditPermission: Permission = { view: true, create: true, edit: true, delete: false };

// 学生权限
const studentPermissions: RolePermissions = {
  courses: readOnlyPermission,
  exams: limitedEditPermission, // 可参与考试但不能删除
  practice: limitedEditPermission,
  errorBook: fullPermission,
  classManagement: defaultPermission,
  examManagement: defaultPermission,
  gradingCenter: defaultPermission,
  questionBank: defaultPermission,
  analyticsReport: defaultPermission,
  learningReport: readOnlyPermission,
  qaForum: fullPermission,
  notificationManagement: defaultPermission,
  userManagement: defaultPermission,
  systemSettings: defaultPermission,
  systemMonitor: defaultPermission,
  auditLogs: defaultPermission,
  schoolDataManagement: defaultPermission,
  teacherManagement: defaultPermission,
  courseApproval: defaultPermission,
};

// 教师权限
const teacherPermissions: RolePermissions = {
  courses: fullPermission,
  exams: fullPermission,
  practice: fullPermission,
  errorBook: readOnlyPermission,
  classManagement: fullPermission,
  examManagement: fullPermission,
  gradingCenter: fullPermission,
  questionBank: fullPermission,
  analyticsReport: fullPermission,
  learningReport: readOnlyPermission,
  qaForum: fullPermission,
  notificationManagement: fullPermission,
  userManagement: defaultPermission,
  systemSettings: defaultPermission,
  systemMonitor: defaultPermission,
  auditLogs: defaultPermission,
  schoolDataManagement: defaultPermission,
  teacherManagement: defaultPermission,
  courseApproval: defaultPermission,
};

// 助教权限
const taPermissions: RolePermissions = {
  courses: readOnlyPermission,
  exams: limitedEditPermission,
  practice: limitedEditPermission,
  errorBook: readOnlyPermission,
  classManagement: limitedEditPermission,
  examManagement: limitedEditPermission,
  gradingCenter: limitedEditPermission,
  questionBank: defaultPermission,
  analyticsReport: readOnlyPermission,
  learningReport: readOnlyPermission,
  qaForum: fullPermission,
  notificationManagement: limitedEditPermission,
  userManagement: defaultPermission,
  systemSettings: defaultPermission,
  systemMonitor: defaultPermission,
  auditLogs: defaultPermission,
  schoolDataManagement: defaultPermission,
  teacherManagement: defaultPermission,
  courseApproval: defaultPermission,
};

// 系统管理员权限
const adminPermissions: RolePermissions = {
  courses: fullPermission,
  exams: fullPermission,
  practice: fullPermission,
  errorBook: fullPermission,
  classManagement: fullPermission,
  examManagement: fullPermission,
  gradingCenter: fullPermission,
  questionBank: fullPermission,
  analyticsReport: fullPermission,
  learningReport: fullPermission,
  qaForum: fullPermission,
  notificationManagement: fullPermission,
  userManagement: fullPermission,
  systemSettings: fullPermission,
  systemMonitor: fullPermission,
  auditLogs: fullPermission,
  schoolDataManagement: fullPermission,
  teacherManagement: fullPermission,
  courseApproval: fullPermission,
};

// 学校管理员权限
const schoolAdminPermissions: RolePermissions = {
  courses: readOnlyPermission,
  exams: readOnlyPermission,
  practice: readOnlyPermission,
  errorBook: readOnlyPermission,
  classManagement: readOnlyPermission,
  examManagement: readOnlyPermission,
  gradingCenter: readOnlyPermission,
  questionBank: readOnlyPermission,
  analyticsReport: fullPermission,
  learningReport: fullPermission,
  qaForum: readOnlyPermission,
  notificationManagement: fullPermission,
  userManagement: limitedEditPermission,
  systemSettings: defaultPermission,
  systemMonitor: readOnlyPermission,
  auditLogs: readOnlyPermission,
  schoolDataManagement: fullPermission,
  teacherManagement: fullPermission,
  courseApproval: fullPermission,
};

const getRolePermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case 'student': return studentPermissions;
    case 'teacher': return teacherPermissions;
    case 'ta': return taPermissions;
    case 'admin': return adminPermissions;
    case 'school_admin': return schoolAdminPermissions;
    default: return studentPermissions;
  }
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
  userRole: UserRole;
}

export function PermissionProvider({ children, userRole }: PermissionProviderProps) {
  const permissions = getRolePermissions(userRole);

  const hasPermission = (module: keyof RolePermissions, action: keyof Permission): boolean => {
    return permissions[module][action];
  };

  const hasModuleAccess = (module: keyof RolePermissions): boolean => {
    return permissions[module].view;
  };

  const value = {
    permissions,
    userRole,
    hasPermission,
    hasModuleAccess
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

// 权限检查组件
interface PermissionGuardProps {
  children: ReactNode;
  module: keyof RolePermissions;
  action: keyof Permission;
  fallback?: ReactNode;
}

export function PermissionGuard({ 
  children, 
  module, 
  action, 
  fallback = null
}: PermissionGuardProps) {
  const { hasPermission } = usePermissions();
  
  const hasAccess = hasPermission(module, action);
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// 模块访问检查组件
interface ModuleGuardProps {
  children: ReactNode;
  module: keyof RolePermissions;
  fallback?: ReactNode;
}

export function ModuleGuard({ children, module, fallback = null }: ModuleGuardProps) {
  const { hasModuleAccess } = usePermissions();
  return hasModuleAccess(module) ? <>{children}</> : <>{fallback}</>;
}
