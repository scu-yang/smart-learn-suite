import type { User, UserRole } from "@/types";

export interface BaseResponse<T> {
  /** 状态码 */
  code: string;

  /** 提示信息 */
  message: string;

  /** 时间戳（毫秒） */
  timestamp: number;

  /** 响应数据 */
  data: T;
}


// 认证相关的 API 响应类型
export interface LoginResponse {
    /** 用户ID */
    uid: number;

    /** 用户邮箱 */
    email: string;

    /** 用户名 */
    username: string;

    /** 用户主要角色 */
    primaryRole: UserRole;

    /** 可用角色列表 */
    availableRoles: UserRole[];

    /** 当前角色 */
    currentRole: UserRole;

    /** 部门/学院 */
    department: string;

    /** 学校 */
    school: string;

    token: string;
}

export function toUser(resp: LoginResponse): User {
  return {
    uid: resp.uid,
    username: resp.username,
    name: resp.username,   // 如果后续有真实姓名字段可替换
    email: resp.email,
    avatar: undefined,     // 后端未提供头像字段，保留为 undefined
    primaryRole: resp.primaryRole,
    availableRoles: resp.availableRoles,
    currentRole: resp.currentRole,
    // 使用了 TypeScript / JavaScript 中的 空值合并运算符 ??，它的含义是:
    // 如果 resp.department 不是 null 或 undefined，就用它的值；
    // 否则使用右边的值（这里是 undefined）
    department: resp.department ?? undefined,
    school: resp.school ?? undefined,
  };
}


// ProfileResponse 字段和 LoginResponse一样
export interface ProfileResponse extends LoginResponse {

}