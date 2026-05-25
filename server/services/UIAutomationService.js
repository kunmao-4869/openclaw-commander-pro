/**
 * Windows UI Automation 控制服务
 * 用于控制已安装的桌面应用程序
 * 使用 PowerShell + UI Automation
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * 执行 PowerShell 命令
 */
async function runPowerShell(command) {
  try {
    const encodedCommand = Buffer.from(command, 'utf16le').toString('base64');
    const result = await execAsync(`powershell -EncodedCommand ${encodedCommand}`, {
      timeout: 10000,
      maxBuffer: 10 * 1024 * 1024
    });
    
    return {
      success: true,
      stdout: result.stdout,
      stderr: result.stderr
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || ''
    };
  }
}

/**
 * 获取窗口句柄
 */
export async function getWindowHandle(windowTitle) {
  const command = `
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class User32 {
        [DllImport("user32.dll")]
        public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
        [DllImport("user32.dll")]
        public static extern bool EnumWindows(IntPtr lpEnumFunc, IntPtr lParam);
        [DllImport("user32.dll")]
        public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
        [DllImport("user32.dll")]
        public static extern int GetWindowTextLength(IntPtr hWnd);
    }
"@
    
    $windows = @()
    $callback = [User32+EnumWindowsProc]{ 
        param($hWnd, $lParam)
        $length = [User32]::GetWindowTextLength($hWnd)
        if ($length -gt 0) {
            $sb = New-Object System.Text.StringBuilder $length
            [User32]::GetWindowText($hWnd, $sb, $length + 1) | Out-Null
            $title = $sb.ToString()
            if ($title -like "*${windowTitle}*") {
                $windows += @{ Handle = $hWnd; Title = $title }
            }
        }
        return $true
    }
    
    [User32]::EnumWindows($callback, [IntPtr]::Zero) | Out-Null
    $windows | ConvertTo-Json
  `;

  const result = await runPowerShell(command);
  
  if (result.success) {
    try {
      const windows = JSON.parse(result.stdout);
      return {
        success: true,
        windows: windows,
        count: windows.length
      };
    } catch (e) {
      return {
        success: false,
        error: '解析窗口列表失败'
      };
    }
  }
  
  return result;
}

/**
 * 激活窗口
 */
export async function activateWindow(windowHandle) {
  const command = `
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class User32 {
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        [DllImport("user32.dll")]
        public static extern bool SetForegroundWindow(IntPtr hWnd);
        [DllImport("user32.dll")]
        public static extern bool IsIconic(IntPtr hWnd);
    }
"@
    
    $hWnd = [IntPtr]${windowHandle}
    
    if ([User32]::IsIconic($hWnd)) {
        [User32]::ShowWindow($hWnd, 9)  # Restore
    }
    
    [User32]::SetForegroundWindow($hWnd) | Out-Null
    "窗口已激活"
  `;

  return await runPowerShell(command);
}

/**
 * 模拟键盘输入
 */
export async function sendKeys(keys) {
  const command = `
    Add-Type -AssemblyName System.Windows.Forms
    
    # 解析按键
    $keyMap = @{
        'ENTER' = 'Enter'
        'TAB' = 'Tab'
        'ESC' = 'Escape'
        'CTRL' = 'ControlKey'
        'ALT' = 'Menu'
        'SHIFT' = 'ShiftKey'
        'WIN' = 'LWin'
        'UP' = 'Up'
        'DOWN' = 'Down'
        'LEFT' = 'Left'
        'RIGHT' = 'Right'
        'SPACE' = 'Space'
        'BACKSPACE' = 'Back'
        'DELETE' = 'Delete'
        'HOME' = 'Home'
        'END' = 'End'
        'PAGEUP' = 'PageUp'
        'PAGEDOWN' = 'PageDown'
    }
    
    $keys = '${keys}'.Split(',')
    foreach ($key in $keys) {
        $key = $key.Trim()
        if ($keyMap.ContainsKey($key)) {
            [System.Windows.Forms.SendKeys]::SendWait('{'+$keyMap[$key]+'}')
        } else {
            [System.Windows.Forms.SendKeys]::SendWait('$key')
        }
        Start-Sleep -Milliseconds 50
    }
    
    "按键已发送：${keys}"
  `;

  return await runPowerShell(command);
}

/**
 * 模拟鼠标点击
 */
export async function mouseClick(x, y, button = 'left') {
  const command = `
    Add-Type -AssemblyName System.Windows.Forms
    
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})
    Start-Sleep -Milliseconds 100
    
    if ('${button}' -eq 'left') {
        [System.Windows.Forms.Cursor]::Position = [System.Windows.Forms.Cursor]::Position
        [System.Windows.Forms.SendKeys]::SendWait('{LButton}')
    } elseif ('${button}' -eq 'right') {
        [System.Windows.Forms.SendKeys]::SendWait('{RButton}')
    } elseif ('${button}' -eq 'double') {
        [System.Windows.Forms.SendKeys]::SendWait('{LButton}')
        Start-Sleep -Milliseconds 100
        [System.Windows.Forms.SendKeys]::SendWait('{LButton}')
    }
    
    "鼠标已点击：(${x}, ${y}) ${button}"
  `;

  return await runPowerShell(command);
}

/**
 * 移动鼠标
 */
export async function mouseMove(x, y) {
  const command = `
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})
    "鼠标已移动到：(${x}, ${y})"
  `;

  return await runPowerShell(command);
}

/**
 * 获取前台窗口信息
 */
export async function getForegroundWindow() {
  const command = `
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class User32 {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")]
        public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
        [DllImport("user32.dll")]
        public static extern int GetWindowTextLength(IntPtr hWnd);
        [DllImport("user32.dll")]
        public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    }
"@
    
    $hWnd = [User32]::GetForegroundWindow()
    $length = [User32]::GetWindowTextLength($hWnd)
    $sb = New-Object System.Text.StringBuilder $length
    [User32]::GetWindowText($hWnd, $sb, $length + 1) | Out-Null
    $title = $sb.ToString()
    
    $processId = 0
    [User32]::GetWindowThreadProcessId($hWnd, [ref]$processId) | Out-Null
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    @{
        Handle = $hWnd
        Title = $title
        ProcessName = $process.ProcessName
        ProcessId = $processId
    } | ConvertTo-Json
  `;

  const result = await runPowerShell(command);
  
  if (result.success) {
    try {
      const windowInfo = JSON.parse(result.stdout);
      return {
        success: true,
        window: windowInfo
      };
    } catch (e) {
      return {
        success: false,
        error: '解析窗口信息失败'
      };
    }
  }
  
  return result;
}

/**
 * 最小化/最大化窗口
 */
export async function setWindowState(windowHandle, state) {
  const command = `
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class User32 {
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    }
"@
    
    $hWnd = [IntPtr]${windowHandle}
    $showCmd = ${state === 'minimize' ? 6 : (state === 'maximize' ? 3 : 9)}
    
    [User32]::ShowWindow($hWnd, $showCmd) | Out-Null
    "窗口状态已设置：${state}"
  `;

  return await runPowerShell(command);
}

/**
 * 关闭窗口
 */
export async function closeWindow(windowHandle) {
  const command = `
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class User32 {
        [DllImport("user32.dll")]
        public static extern bool PostMessage(IntPtr hWnd, uint Msg, uint wParam, uint lParam);
    }
"@
    
    $hWnd = [IntPtr]${windowHandle}
    [User32]::PostMessage($hWnd, 0x0010, 0, 0) | Out-Null  # WM_CLOSE
    "窗口已关闭"
  `;

  return await runPowerShell(command);
}

// 导出 API
export const UIAutomation = {
  getWindowHandle,
  activateWindow,
  sendKeys,
  mouseClick,
  mouseMove,
  getForegroundWindow,
  setWindowState,
  closeWindow
};
