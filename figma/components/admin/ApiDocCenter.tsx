import React, { useState } from 'react';
import { Code, Book, Key, Download, Copy, Play, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  category: string;
  requiresAuth: boolean;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  examples: Example[];
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface RequestBody {
  required: boolean;
  contentType: string;
  schema: string;
  example: string;
}

interface Response {
  status: number;
  description: string;
  example: string;
}

interface Example {
  language: string;
  code: string;
}

export function ApiDocCenter() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  // Mock API endpoints
  const apiEndpoints: ApiEndpoint[] = [
    {
      id: 'auth-login',
      method: 'POST',
      path: '/api/auth/login',
      summary: '用户登录',
      description: '验证用户凭据并返回JWT令牌',
      category: 'authentication',
      requiresAuth: false,
      requestBody: {
        required: true,
        contentType: 'application/json',
        schema: '{"email": "string", "password": "string"}',
        example: '{"email": "teacher@example.com", "password": "password123"}'
      },
      responses: [
        {
          status: 200,
          description: '登录成功',
          example: '{"code": 200, "message": "success", "data": {"token": "jwt_token_here", "user": {"id": 1, "name": "张老师", "role": "teacher"}}}'
        },
        {
          status: 401,
          description: '登录失败',
          example: '{"code": 401, "message": "用户名或密码错误"}'
        }
      ],
      examples: [
        {
          language: 'curl',
          code: `curl -X POST "${window.location.origin}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "teacher@example.com", "password": "password123"}'`
        },
        {
          language: 'javascript',
          code: `fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'teacher@example.com',
    password: 'password123'
  })
}).then(response => response.json());`
        }
      ]
    },
    {
      id: 'courses-list',
      method: 'GET',
      path: '/api/courses',
      summary: '获取课程列表',
      description: '获取当前用户有权限访问的所有课程',
      category: 'courses',
      requiresAuth: true,
      parameters: [
        {
          name: 'page',
          type: 'integer',
          required: false,
          description: '页码，从1开始',
          example: '1'
        },
        {
          name: 'limit',
          type: 'integer',
          required: false,
          description: '每页数量，默认20',
          example: '20'
        },
        {
          name: 'search',
          type: 'string',
          required: false,
          description: '搜索关键词',
          example: '数学'
        }
      ],
      responses: [
        {
          status: 200,
          description: '获取成功',
          example: '{"code": 200, "data": {"courses": [{"id": 1, "name": "高等数学", "description": "大学数学基础课程"}], "total": 1, "page": 1, "limit": 20}}'
        }
      ],
      examples: [
        {
          language: 'curl',
          code: `curl -X GET "${window.location.origin}/api/courses?page=1&limit=20" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
        },
        {
          language: 'javascript',
          code: `fetch('/api/courses?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
}).then(response => response.json());`
        }
      ]
    },
    {
      id: 'questions-create',
      method: 'POST',
      path: '/api/questions',
      summary: '创建题目',
      description: '创建新的题目到题库中',
      category: 'questions',
      requiresAuth: true,
      requestBody: {
        required: true,
        contentType: 'application/json',
        schema: '{"content": "string", "answer": "string", "type": "string", "difficulty": "number", "knowledgePoints": ["string"]}',
        example: '{"content": "计算 $\\\\int x^2 dx$", "answer": "$\\\\frac{x^3}{3} + C$", "type": "calculation", "difficulty": 0.6, "knowledgePoints": ["积分基础"]}'
      },
      responses: [
        {
          status: 201,
          description: '创建成功',
          example: '{"code": 201, "message": "题目创建成功", "data": {"id": 123, "content": "计算 $\\\\int x^2 dx$"}}'
        }
      ],
      examples: [
        {
          language: 'curl',
          code: `curl -X POST "${window.location.origin}/api/questions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{"content": "计算题目", "answer": "答案"}'`
        }
      ]
    },
    {
      id: 'exams-submit',
      method: 'POST',
      path: '/api/exams/{examId}/submit',
      summary: '提交考试答案',
      description: '学生提交考试的答案',
      category: 'exams',
      requiresAuth: true,
      parameters: [
        {
          name: 'examId',
          type: 'integer',
          required: true,
          description: '考试ID',
          example: '123'
        }
      ],
      requestBody: {
        required: true,
        contentType: 'application/json',
        schema: '{"answers": [{"questionId": "number", "answer": "string"}]}',
        example: '{"answers": [{"questionId": 1, "answer": "积分结果"}, {"questionId": 2, "answer": "选项A"}]}'
      },
      responses: [
        {
          status: 200,
          description: '提交成功',
          example: '{"code": 200, "message": "答案提交成功", "data": {"submissionId": 456}}'
        }
      ],
      examples: [
        {
          language: 'curl',
          code: `curl -X POST "${window.location.origin}/api/exams/123/submit" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{"answers": [{"questionId": 1, "answer": "答案内容"}]}'`
        }
      ]
    }
  ];

  const categories = [
    { value: 'all', label: '全部接口' },
    { value: 'authentication', label: '用户认证' },
    { value: 'courses', label: '课程管理' },
    { value: 'questions', label: '题库管理' },
    { value: 'exams', label: '考试管理' },
    { value: 'grading', label: '批改系统' },
    { value: 'analytics', label: '数据分析' }
  ];

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesSearch = endpoint.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectedEndpointData = selectedEndpoint ? 
    apiEndpoints.find(e => e.id === selectedEndpoint) : null;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">API 文档中心</h1>
        <p className="text-muted-foreground">
          智慧教学系统 REST API 接口文档和开发者资源
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">接口概览</TabsTrigger>
          <TabsTrigger value="authentication">认证说明</TabsTrigger>
          <TabsTrigger value="sdk">SDK 下载</TabsTrigger>
          <TabsTrigger value="testing">接口测试</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：接口列表 */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>API 接口</CardTitle>
                  <div className="space-y-2">
                    <Input
                      placeholder="搜索接口..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredEndpoints.map((endpoint) => (
                      <div
                        key={endpoint.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedEndpoint === endpoint.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedEndpoint(endpoint.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          {endpoint.requiresAuth && (
                            <Key className="h-3 w-3 text-orange-500" title="需要认证" />
                          )}
                        </div>
                        <p className="font-medium text-sm">{endpoint.summary}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {endpoint.path}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：接口详情 */}
            <div className="lg:col-span-2">
              {selectedEndpointData ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Badge className={getMethodColor(selectedEndpointData.method)}>
                            {selectedEndpointData.method}
                          </Badge>
                          {selectedEndpointData.summary}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-mono mt-1">
                          {selectedEndpointData.path}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">描述</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedEndpointData.description}
                      </p>
                    </div>

                    {selectedEndpointData.parameters && selectedEndpointData.parameters.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">请求参数</h3>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left p-3">参数名</th>
                                <th className="text-left p-3">类型</th>
                                <th className="text-left p-3">必需</th>
                                <th className="text-left p-3">说明</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedEndpointData.parameters.map((param, index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-3 font-mono">{param.name}</td>
                                  <td className="p-3">{param.type}</td>
                                  <td className="p-3">
                                    {param.required ? (
                                      <Badge variant="destructive" className="text-xs">必需</Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-xs">可选</Badge>
                                    )}
                                  </td>
                                  <td className="p-3">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedEndpointData.requestBody && (
                      <div>
                        <h3 className="font-medium mb-2">请求体</h3>
                        <div className="space-y-2">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">Content-Type:</span> {selectedEndpointData.requestBody.contentType}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">必需:</span> {selectedEndpointData.requestBody.required ? '是' : '否'}
                            </p>
                          </div>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                              {JSON.stringify(JSON.parse(selectedEndpointData.requestBody.example), null, 2)}
                            </pre>
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(selectedEndpointData.requestBody!.example)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium mb-2">响应示例</h3>
                      <div className="space-y-3">
                        {selectedEndpointData.responses.map((response, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={response.status === 200 ? "default" : "destructive"}>
                                {response.status}
                              </Badge>
                              <span className="text-sm">{response.description}</span>
                            </div>
                            <div className="relative">
                              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                                {JSON.stringify(JSON.parse(response.example), null, 2)}
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(response.example)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">代码示例</h3>
                      <Tabs defaultValue="curl">
                        <TabsList>
                          {selectedEndpointData.examples.map((example) => (
                            <TabsTrigger key={example.language} value={example.language}>
                              {example.language.toUpperCase()}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {selectedEndpointData.examples.map((example) => (
                          <TabsContent key={example.language} value={example.language}>
                            <div className="relative">
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                {example.code}
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(example.code)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        请从左侧选择一个 API 接口查看详细文档
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>认证说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">JWT 令牌认证</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  本系统使用 JWT (JSON Web Token) 进行用户身份认证。所有需要认证的接口都需要在请求头中携带有效的 JWT 令牌。
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">获取令牌</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    通过 <code>/api/auth/login</code> 接口登录后，响应中会包含 JWT 令牌：
                  </p>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
{`{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "张老师",
      "role": "teacher"
    }
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">使用令牌</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  在后续的 API 请求中，需要在 Authorization 请求头中携带令牌：
                </p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
                  <code>Authorization: Bearer YOUR_JWT_TOKEN</code>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">令牌过期</h3>
                <p className="text-sm text-muted-foreground">
                  JWT 令牌有效期为 2 小时。令牌过期后，会返回 401 状态码，需要重新登录获取新令牌。
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">权限控制</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  不同角色的用户有不同的 API 访问权限：
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>学生</Badge>
                    <span className="text-sm">可访问学习相关接口，如考试、练习、成绩查询等</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>教师</Badge>
                    <span className="text-sm">可访问教学相关接口，如课程管理、题库管理、批改等</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>助教</Badge>
                    <span className="text-sm">权限受限的教师，具体权限由主讲教师分配</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>管理员</Badge>
                    <span className="text-sm">可访问所有接口，包括用户管理、系统配置等</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdk">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  JavaScript SDK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  适用于前端开发和 Node.js 环境的 JavaScript SDK
                </p>
                <div className="space-y-2">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    下载 JavaScript SDK
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Book className="h-4 w-4 mr-2" />
                    查看文档
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Java SDK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  适用于 Java 和 Android 开发的官方 SDK
                </p>
                <div className="space-y-2">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    下载 Java SDK
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Book className="h-4 w-4 mr-2" />
                    查看文档
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Python SDK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  适用于 Python 开发和数据分析的 SDK
                </p>
                <div className="space-y-2">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    下载 Python SDK
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Book className="h-4 w-4 mr-2" />
                    查看文档
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>快速开始</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">安装 JavaScript SDK</h3>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
                    <code>npm install @eduai/javascript-sdk</code>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">基本用法</h3>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
{`import { EduAIClient } from '@eduai/javascript-sdk';

const client = new EduAIClient({
  baseURL: '${window.location.origin}/api',
  token: 'YOUR_JWT_TOKEN'
});

// 获取课程列表
const courses = await client.courses.list();

// 创建题目
const question = await client.questions.create({
  content: '计算题目',
  answer: '答案',
  type: 'calculation'
});`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>API 接口测试</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">接口地址</label>
                    <Input placeholder="例如: /api/courses" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">请求方法</label>
                    <Select defaultValue="GET">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">认证令牌</label>
                  <Input placeholder="Bearer YOUR_JWT_TOKEN" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">请求体 (JSON)</label>
                  <Textarea 
                    placeholder='{"key": "value"}'
                    rows={6}
                  />
                </div>

                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  发送请求
                </Button>

                <div>
                  <label className="block text-sm font-medium mb-2">响应结果</label>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-32">
                    <p className="text-sm text-muted-foreground">点击"发送请求"查看响应结果</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}