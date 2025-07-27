import React, { ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { Button } from '../ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

interface ResizableLayoutProps {
  children: ReactNode[];
  defaultSizes?: number[];
  minSizes?: number[];
  maxSizes?: number[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
  onResize?: (sizes: number[]) => void;
  resizerStyle?: React.CSSProperties;
  resizerClassName?: string;
  enableCollapse?: boolean;
  collapsedSizes?: number[];
  panelLabels?: string[];
  enableFullscreen?: boolean;
}

interface ResizablePanelProps {
  children: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  label?: string;
  direction?: 'horizontal' | 'vertical';
  enableFullscreen?: boolean;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  isLast?: boolean;
}

// 单个可调整大小的面板组件
export function ResizablePanel({ 
  children, 
  defaultSize = 300, 
  minSize = 200, 
  maxSize = 800, 
  className = '',
  isCollapsed = false,
  onToggleCollapse,
  label,
  direction = 'horizontal',
  enableFullscreen = false,
  onFullscreen,
  isFullscreen = false,
  isLast = false
}: ResizablePanelProps) {
  const [currentSize, setCurrentSize] = useState(defaultSize);
  const [lastSize, setLastSize] = useState(defaultSize);

  const handleCollapse = useCallback(() => {
    if (isCollapsed) {
      setCurrentSize(lastSize);
    } else {
      setLastSize(currentSize);
      setCurrentSize(direction === 'horizontal' ? 50 : 30);
    }
    onToggleCollapse?.();
  }, [isCollapsed, currentSize, lastSize, direction, onToggleCollapse]);

  const isHorizontal = direction === 'horizontal';
  
  // 如果是最后一个面板，不使用Resizable，直接占用剩余空间
  if (isLast) {
    return (
      <div className={`flex-1 min-w-0 ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background shadow-2xl' : ''}`}>
        <div className="w-full h-full flex flex-col bg-card border-r border-border">
          {/* Panel Header */}
          <div className="h-10 px-3 flex items-center justify-between bg-muted/30 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              {!isCollapsed && label && (
                <span className="text-sm font-medium text-muted-foreground truncate">
                  {label}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {enableFullscreen && !isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={onFullscreen}
                  title={isFullscreen ? "退出全屏" : "全屏"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3 h-3" />
                  ) : (
                    <Maximize2 className="w-3 h-3" />
                  )}
                </Button>
              )}
              
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={handleCollapse}
                  title={isCollapsed ? "展开" : "折叠"}
                >
                  {isCollapsed ? (
                    isHorizontal ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  ) : (
                    isHorizontal ? <ChevronLeft className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Panel Content - 关键修复：确保滚动工作 */}
          <div className="flex-1 min-h-0">
            {isCollapsed ? (
              <div className="h-full flex items-center justify-center p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={handleCollapse}
                  title="展开面板"
                >
                  {isHorizontal ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            ) : (
              // 直接渲染children，确保高度正确传递
              children
            )}
          </div>
        </div>
      </div>
    );
  }

  const sizeStyle = isHorizontal ? 
    { width: isCollapsed ? 50 : currentSize, height: '100%' } : 
    { width: '100%', height: isCollapsed ? 30 : currentSize };

  const enableConfig = isHorizontal ? {
    top: false,
    right: !isCollapsed,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  } : {
    top: false,
    right: false,
    bottom: !isCollapsed,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  const handleStyles = isHorizontal ? {
    right: {
      width: '6px',
      right: '-3px',
      backgroundColor: 'transparent',
      cursor: 'col-resize',
      zIndex: 10,
      borderRight: '1px solid var(--border)',
      transition: 'border-color 0.2s ease',
    },
  } : {
    bottom: {
      height: '6px',
      bottom: '-3px',
      backgroundColor: 'transparent',
      cursor: 'row-resize',
      zIndex: 10,
      borderBottom: '1px solid var(--border)',
      transition: 'border-color 0.2s ease',
    },
  };

  return (
    <Resizable
      size={sizeStyle}
      minWidth={isHorizontal ? (isCollapsed ? 50 : minSize) : undefined}
      maxWidth={isHorizontal ? (isCollapsed ? 50 : maxSize) : undefined}
      minHeight={!isHorizontal ? (isCollapsed ? 30 : minSize) : undefined}
      maxHeight={!isHorizontal ? (isCollapsed ? 30 : maxSize) : undefined}
      enable={enableConfig}
      onResizeStop={(e, direction, ref, d) => {
        if (!isCollapsed) {
          const newSize = isHorizontal ? 
            currentSize + d.width : 
            currentSize + d.height;
          setCurrentSize(newSize);
        }
      }}
      handleStyles={handleStyles}
      handleClasses={{
        [isHorizontal ? 'right' : 'bottom']: 'hover:border-primary transition-colors group',
      }}
      className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background shadow-2xl' : ''}`}
    >
      <div className="h-full w-full flex flex-col bg-card border-r border-border overflow-hidden">
        {/* Panel Header */}
        <div className="h-10 px-3 flex items-center justify-between bg-muted/30 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            {!isCollapsed && label && (
              <span className="text-sm font-medium text-muted-foreground truncate">
                {label}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {enableFullscreen && !isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={onFullscreen}
                title={isFullscreen ? "退出全屏" : "全屏"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3 h-3" />
                ) : (
                  <Maximize2 className="w-3 h-3" />
                )}
              </Button>
            )}
            
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={handleCollapse}
                title={isCollapsed ? "展开" : "折叠"}
              >
                {isCollapsed ? (
                  isHorizontal ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                ) : (
                  isHorizontal ? <ChevronLeft className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Panel Content - 关键修复：确保滚动工作 */}
        <div className="flex-1 min-h-0">
          {isCollapsed ? (
            <div className="h-full flex items-center justify-center p-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={handleCollapse}
                title="展开面板"
              >
                {isHorizontal ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          ) : (
            // 直接渲染children，确保高度正确传递
            children
          )}
        </div>

        {/* Resize Handle Visual Indicator */}
        {!isCollapsed && (
          <div className={`absolute ${isHorizontal ? 'top-0 right-0 w-1 h-full' : 'bottom-0 left-0 w-full h-1'}`}>
            <div className={`${isHorizontal ? 'w-full h-full hover:bg-primary/20' : 'w-full h-full hover:bg-primary/20'} transition-colors ${isHorizontal ? 'cursor-col-resize' : 'cursor-row-resize'} group-hover:bg-primary/30 flex items-center justify-center`}>
              <div className={`${isHorizontal ? 'w-0.5 h-8' : 'w-8 h-0.5'} bg-border group-hover:bg-primary rounded-full opacity-0 hover:opacity-100 transition-opacity`} />
            </div>
          </div>
        )}
      </div>
    </Resizable>
  );
}

// 多面板布局组件
export function ResizableLayout({ 
  children, 
  defaultSizes = [], 
  minSizes = [], 
  maxSizes = [],
  direction = 'horizontal',
  className = '',
  onResize,
  enableCollapse = true,
  collapsedSizes = [],
  panelLabels = [],
  enableFullscreen = false
}: ResizableLayoutProps) {
  const [sizes, setSizes] = useState<number[]>(defaultSizes);
  const [collapsedPanels, setCollapsedPanels] = useState<boolean[]>(
    children.map(() => false)
  );
  const [fullscreenPanel, setFullscreenPanel] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoint detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  // Auto-collapse panels on mobile
  useEffect(() => {
    if (isMobile && children.length > 2) {
      // On mobile, collapse all but the main panel (usually index 1)
      setCollapsedPanels(prev => prev.map((_, index) => index !== 1));
    } else if (isTablet && children.length > 3) {
      // On tablet, collapse side panels if there are more than 3
      setCollapsedPanels(prev => prev.map((_, index) => index === 0 || index === children.length - 1));
    }
  }, [isMobile, isTablet, children.length]);

  const handleResize = useCallback((index: number, newSize: number) => {
    const newSizes = [...sizes];
    newSizes[index] = newSize;
    setSizes(newSizes);
    onResize?.(newSizes);
  }, [sizes, onResize]);

  const handleToggleCollapse = useCallback((index: number) => {
    setCollapsedPanels(prev => {
      const newCollapsed = [...prev];
      newCollapsed[index] = !newCollapsed[index];
      return newCollapsed;
    });
  }, []);

  const handleFullscreen = useCallback((index: number) => {
    setFullscreenPanel(current => current === index ? null : index);
  }, []);

  const handleCollapseAll = useCallback(() => {
    setCollapsedPanels(children.map(() => true));
  }, [children]);

  const handleExpandAll = useCallback(() => {
    setCollapsedPanels(children.map(() => false));
  }, [children]);

  const resetLayout = useCallback(() => {
    setSizes(defaultSizes);
    setCollapsedPanels(children.map(() => false));
    setFullscreenPanel(null);
  }, [defaultSizes, children]);

  useEffect(() => {
    if (defaultSizes.length > 0) {
      setSizes(defaultSizes);
    }
  }, [defaultSizes]);

  const flexDirection = direction === 'horizontal' ? 'flex-row' : 'flex-col';

  // If a panel is fullscreen, only show that panel
  if (fullscreenPanel !== null) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <ResizablePanel
          defaultSize={0}
          minSize={0}
          maxSize={0}
          className="w-full h-full"
          isCollapsed={false}
          label={panelLabels[fullscreenPanel]}
          direction={direction}
          enableFullscreen={true}
          onFullscreen={() => handleFullscreen(fullscreenPanel)}
          isFullscreen={true}
          isLast={true}
        >
          {children[fullscreenPanel]}
        </ResizablePanel>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Layout Controls */}
      {enableCollapse && (
        <div className="h-8 px-3 flex items-center justify-between bg-muted/20 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              布局控制
            </span>
            {isMobile && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                移动设备
              </span>
            )}
            {isTablet && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                平板设备
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleExpandAll}
            >
              全部展开
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleCollapseAll}
            >
              全部折叠
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={resetLayout}>
                  重置布局
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {panelLabels.map((label, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleToggleCollapse(index)}
                  >
                    {collapsedPanels[index] ? '展开' : '折叠'} {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Main Layout - 关键修复：确保高度正确 */}
      <div 
        ref={containerRef}
        className={`flex ${flexDirection} flex-1 min-h-0 overflow-hidden`}
      >
        {children.map((child, index) => {
          const isLast = index === children.length - 1;
          const defaultSize = defaultSizes[index] || (direction === 'horizontal' ? 300 : 200);
          const minSize = minSizes[index] || (direction === 'horizontal' ? 200 : 100);
          const maxSize = maxSizes[index] || (direction === 'horizontal' ? 800 : 400);
          const isCollapsed = collapsedPanels[index];

          // Responsive size adjustments
          let responsiveDefaultSize = defaultSize;
          let responsiveMinSize = minSize;
          
          if (isMobile) {
            responsiveDefaultSize = Math.min(defaultSize, direction === 'horizontal' ? 250 : 150);
            responsiveMinSize = Math.min(minSize, direction === 'horizontal' ? 180 : 80);
          } else if (isTablet) {
            responsiveDefaultSize = Math.min(defaultSize, direction === 'horizontal' ? 280 : 180);
            responsiveMinSize = Math.min(minSize, direction === 'horizontal' ? 200 : 100);
          }

          return (
            <ResizablePanel
              key={index}
              defaultSize={responsiveDefaultSize}
              minSize={responsiveMinSize}
              maxSize={maxSize}
              className={isLast ? "" : "flex-shrink-0"}
              isCollapsed={isCollapsed}
              onToggleCollapse={enableCollapse ? () => handleToggleCollapse(index) : undefined}
              label={panelLabels[index]}
              direction={direction}
              enableFullscreen={enableFullscreen}
              onFullscreen={() => handleFullscreen(index)}
              isLast={isLast}
            >
              {child}
            </ResizablePanel>
          );
        })}
      </div>
    </div>
  );
}

// 改进的侧边栏组件
export function ResizableSidebar({ 
  children, 
  defaultWidth = 250, 
  minWidth = 200, 
  maxWidth = 400, 
  className = '',
  enableCollapse = true,
  label = "侧边栏"
}: {
  children: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  enableCollapse?: boolean;
  label?: string;
}) {
  const [width, setWidth] = useState(defaultWidth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastWidth, setLastWidth] = useState(defaultWidth);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isCollapsed) {
        // Auto-collapse on mobile
        handleCollapse();
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isCollapsed]);

  const handleCollapse = useCallback(() => {
    if (isCollapsed) {
      setWidth(lastWidth);
      setIsCollapsed(false);
    } else {
      setLastWidth(width);
      setWidth(60);
      setIsCollapsed(true);
    }
  }, [isCollapsed, width, lastWidth]);

  return (
    <Resizable
      size={{ width: width, height: '100%' }}
      minWidth={isCollapsed ? 60 : minWidth}
      maxWidth={isCollapsed ? 60 : maxWidth}
      enable={{
        top: false,
        right: !isCollapsed,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onResizeStop={(e, direction, ref, d) => {
        if (!isCollapsed) {
          setWidth(width + d.width);
        }
      }}
      handleStyles={{
        right: {
          width: '6px',
          right: '-3px',
          backgroundColor: 'transparent',
          cursor: 'col-resize',
          zIndex: 10,
        },
      }}
      handleClasses={{
        right: 'border-r border-border hover:border-primary transition-colors',
      }}
      className={className}
    >
      <div className="h-full overflow-hidden relative bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Sidebar Header */}
        {enableCollapse && (
          <div className="h-12 px-3 flex items-center justify-between bg-sidebar-primary/5 border-b flex-shrink-0">
            {!isCollapsed && (
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {label}
              </span>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleCollapse}
              title={isCollapsed ? "展开侧边栏" : "折叠侧边栏"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
        
        {/* Sidebar Content - 关键修复：确保滚动工作 */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
        
        {/* 拖拽指示器 */}
        {!isCollapsed && (
          <div className="absolute top-0 right-0 w-1 h-full">
            <div className="w-full h-full hover:bg-primary/10 transition-colors cursor-col-resize flex items-center justify-center">
              <div className="w-0.5 h-8 bg-border group-hover:bg-primary rounded-full opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}

        {/* Mobile overlay */}
        {isMobile && !isCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleCollapse}
          />
        )}
      </div>
    </Resizable>
  );
}

// 用于存储布局偏好设置的Hook
export function useLayoutPreferences(key: string) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(`layout-${key}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const updatePreferences = useCallback((newPrefs: any) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(`layout-${key}`, JSON.stringify(newPrefs));
    } catch {
      // Ignore localStorage errors
    }
  }, [key]);

  return [preferences, updatePreferences];
}

export default ResizableLayout;