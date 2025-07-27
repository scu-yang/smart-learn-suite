import React, { createContext, useContext, ReactNode } from 'react';

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface TAPermissions {
  classStudentManagement: Permission;
  homeworkGrading: Permission;
  classAnnouncementManagement: Permission;
  courseResourceManagement: Permission;
  learningDataView: Permission;
  discussionManagement: Permission;
  // 新增更细粒度的权限
  classManagement: Permission;
  examManagement: Permission;
  gradingCenter: Permission;
  analyticsReport: Permission;
  qaForum: Permission;
  notificationManagement: Permission;
  questionBank: Permission;
  assignmentCreation: Permission;
  courseManagement: Permission;
}

export interface PermissionContextType {
  permissions: TAPermissions;
  userRole: 'teacher' | 'ta';
  isTeacher: boolean;
  isTA: boolean;
  hasPermission: (module: keyof TAPermissions, action: keyof Permission) => boolean;
  canEditOwnContent: (module: keyof TAPermissions, isOwnContent: boolean) => boolean;
  hasModuleAccess: (module: keyof TAPermissions) => boolean;
}

const defaultTAPermissions: TAPermissions = {
  // 原有权限
  classStudentManagement: { view: true, create: true, edit: true, delete: true },
  homeworkGrading: { view: true, create: false, edit: true, delete: false },
  classAnnouncementManagement: { view: true, create: true, edit: true, delete: true },
  courseResourceManagement: { view: true, create: true, edit: true, delete: true },
  learningDataView: { view: true, create: false, edit: false, delete: false },
  discussionManagement: { view: true, create: false, edit: true, delete: true },
  // 新增权限 - 助教默认权限
  classManagement: { view: true, create: false, edit: true, delete: false },
  examManagement: { view: true, create: true, edit: true, delete: false },
  gradingCenter: { view: true, create: false, edit: true, delete: false },
  analyticsReport: { view: true, create: false, edit: false, delete: false },
  qaForum: { view: true, create: true, edit: true, delete: true },
  notificationManagement: { view: true, create: true, edit: true, delete: true },
  questionBank: { view: false, create: false, edit: false, delete: false },
  assignmentCreation: { view: false, create: false, edit: false, delete: false },
  courseManagement: { view: false, create: false, edit: false, delete: false }
};

const fullTeacherPermissions: TAPermissions = {
  // 教师拥有所有权限
  classStudentManagement: { view: true, create: true, edit: true, delete: true },
  homeworkGrading: { view: true, create: true, edit: true, delete: true },
  classAnnouncementManagement: { view: true, create: true, edit: true, delete: true },
  courseResourceManagement: { view: true, create: true, edit: true, delete: true },
  learningDataView: { view: true, create: true, edit: true, delete: true },
  discussionManagement: { view: true, create: true, edit: true, delete: true },
  classManagement: { view: true, create: true, edit: true, delete: true },
  examManagement: { view: true, create: true, edit: true, delete: true },
  gradingCenter: { view: true, create: true, edit: true, delete: true },
  analyticsReport: { view: true, create: true, edit: true, delete: true },
  qaForum: { view: true, create: true, edit: true, delete: true },
  notificationManagement: { view: true, create: true, edit: true, delete: true },
  questionBank: { view: true, create: true, edit: true, delete: true },
  assignmentCreation: { view: true, create: true, edit: true, delete: true },
  courseManagement: { view: true, create: true, edit: true, delete: true }
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
  userRole: 'teacher' | 'ta';
  customPermissions?: Partial<TAPermissions>;
}

export function PermissionProvider({ 
  children, 
  userRole, 
  customPermissions = {} 
}: PermissionProviderProps) {
  const basePermissions = userRole === 'teacher' 
    ? fullTeacherPermissions 
    : defaultTAPermissions;
    
  // 合并自定义权限
  const permissions = { ...basePermissions };
  Object.keys(customPermissions).forEach(key => {
    const permissionKey = key as keyof TAPermissions;
    if (customPermissions[permissionKey]) {
      permissions[permissionKey] = { ...permissions[permissionKey], ...customPermissions[permissionKey] };
    }
  });
  
  const isTeacher = userRole === 'teacher';
  const isTA = userRole === 'ta';

  const hasPermission = (module: keyof TAPermissions, action: keyof Permission): boolean => {
    return permissions[module][action];
  };

  const hasModuleAccess = (module: keyof TAPermissions): boolean => {
    return permissions[module].view;
  };

  const canEditOwnContent = (module: keyof TAPermissions, isOwnContent: boolean): boolean => {
    if (isTeacher) return true;
    
    // 对于课程资源管理和班级公告管理，助教只能编辑/删除自己创建的内容
    if ((module === 'courseResourceManagement' || module === 'classAnnouncementManagement') && 
        !isOwnContent) {
      return false;
    }
    
    return permissions[module].edit;
  };

  const value = {
    permissions,
    userRole,
    isTeacher,
    isTA,
    hasPermission,
    canEditOwnContent,
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

// 权限检查高阶组件
interface PermissionGuardProps {
  children: ReactNode;
  module: keyof TAPermissions;
  action: keyof Permission;
  fallback?: ReactNode;
  isOwnContent?: boolean;
}

export function PermissionGuard({ 
  children, 
  module, 
  action, 
  fallback = null, 
  isOwnContent = true 
}: PermissionGuardProps) {
  const { hasPermission, canEditOwnContent } = usePermissions();
  
  const hasAccess = action === 'edit' || action === 'delete' 
    ? canEditOwnContent(module, isOwnContent)
    : hasPermission(module, action);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// 模块访问检查组件
interface ModuleGuardProps {
  children: ReactNode;
  module: keyof TAPermissions;
  fallback?: ReactNode;
}

export function ModuleGuard({ children, module, fallback = null }: ModuleGuardProps) {
  const { hasModuleAccess } = usePermissions();
  return hasModuleAccess(module) ? <>{children}</> : <>{fallback}</>;
}

// 权限模板
export const PERMISSION_TEMPLATES = {
  FULL_PERMISSIONS: 'full',
  GRADING_ASSISTANT: 'grading',
  QA_ASSISTANT: 'qa',
  CLASS_ASSISTANT: 'class'
} as const;

export function getPermissionTemplate(template: string): Partial<TAPermissions> {
  switch (template) {
    case PERMISSION_TEMPLATES.FULL_PERMISSIONS:
      return {
        classStudentManagement: { view: true, create: true, edit: true, delete: true },
        homeworkGrading: { view: true, create: false, edit: true, delete: false },
        classAnnouncementManagement: { view: true, create: true, edit: true, delete: true },
        courseResourceManagement: { view: true, create: true, edit: true, delete: true },
        learningDataView: { view: true, create: false, edit: false, delete: false },
        discussionManagement: { view: true, create: false, edit: true, delete: true },
        classManagement: { view: true, create: false, edit: true, delete: false },
        examManagement: { view: true, create: true, edit: true, delete: false },
        gradingCenter: { view: true, create: false, edit: true, delete: false },
        analyticsReport: { view: true, create: false, edit: false, delete: false },
        qaForum: { view: true, create: true, edit: true, delete: true },
        notificationManagement: { view: true, create: true, edit: true, delete: true }
      };
    
    case PERMISSION_TEMPLATES.GRADING_ASSISTANT:
      return {
        classStudentManagement: { view: true, create: false, edit: false, delete: false },
        homeworkGrading: { view: true, create: false, edit: true, delete: false },
        gradingCenter: { view: true, create: false, edit: true, delete: false },
        analyticsReport: { view: true, create: false, edit: false, delete: false },
        classAnnouncementManagement: { view: false, create: false, edit: false, delete: false },
        courseResourceManagement: { view: false, create: false, edit: false, delete: false },
        discussionManagement: { view: false, create: false, edit: false, delete: false },
        qaForum: { view: false, create: false, edit: false, delete: false },
        notificationManagement: { view: false, create: false, edit: false, delete: false }
      };
    
    case PERMISSION_TEMPLATES.QA_ASSISTANT:
      return {
        qaForum: { view: true, create: true, edit: true, delete: true },
        discussionManagement: { view: true, create: false, edit: true, delete: true },
        classAnnouncementManagement: { view: true, create: true, edit: true, delete: true },
        notificationManagement: { view: true, create: true, edit: true, delete: true },
        classStudentManagement: { view: false, create: false, edit: false, delete: false },
        homeworkGrading: { view: false, create: false, edit: false, delete: false },
        courseResourceManagement: { view: false, create: false, edit: false, delete: false },
        learningDataView: { view: false, create: false, edit: false, delete: false }
      };

    case PERMISSION_TEMPLATES.CLASS_ASSISTANT:
      return {
        classManagement: { view: true, create: false, edit: true, delete: false },
        classStudentManagement: { view: true, create: true, edit: true, delete: false },
        examManagement: { view: true, create: true, edit: true, delete: false },
        gradingCenter: { view: true, create: false, edit: true, delete: false },
        analyticsReport: { view: true, create: false, edit: false, delete: false },
        qaForum: { view: true, create: true, edit: true, delete: true },
        notificationManagement: { view: true, create: true, edit: true, delete: true }
      };
    
    default:
      return defaultTAPermissions;
  }
}