/**
 * 虚拟滚动的消息列表
 * 使用 react-window 实现高性能的长期对话显示
 */

import React, { useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { User, Bot } from 'lucide-react';

/**
 * 消息行组件
 */
function MessageRow({ index, style, data }) {
  const message = data[index];

  if (!message) {
    return null;
  }

  return (
    <div style={style} className="px-6 py-2">
      <div
        className={`flex ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={`max-w-3xl rounded-2xl px-6 py-4 ${
            message.role === 'user'
              ? 'bg-primary-600 text-white'
              : 'bg-dark-800 text-dark-100'
          }`}
        >
          {/* 发送者标识 */}
          <div className="flex items-center space-x-2 text-sm opacity-60 mb-2">
            {message.role === 'user' ? (
              <>
                <User className="w-4 h-4" />
                <span>你</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>AI 助手</span>
              </>
            )}
          </div>

          {/* 消息内容 */}
          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {/* 时间戳 */}
          {message.timestamp && (
            <div className="text-xs opacity-40 mt-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 虚拟消息列表组件
 */
export default function VirtualMessageList({ messages, isLoading }) {
  const listRef = useRef(null);

  // 当消息变化时，自动滚动到底部
  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length);
    }
  }, [messages.length]);

  // 如果没有消息，显示欢迎界面
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-dark-600" />
          <div className="text-dark-500 text-lg">开始对话</div>
          <div className="text-dark-600 text-sm mt-2">
            输入消息开始与 AI 助手交流
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <List
        ref={listRef}
        height="100%"
        itemCount={messages.length}
        itemSize={150} // 每条消息的大致高度
        width="100%"
        itemData={messages}
      >
        {MessageRow}
      </List>

      {/* 加载指示器 */}
      {isLoading && (
        <div className="px-6 py-4">
          <div className="flex justify-start">
            <div className="bg-dark-800 rounded-2xl px-6 py-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 带缓存的消息组件
 * 避免重复渲染相同的消息
 */
export function CachedMessage({ message }) {
  const cachedContent = useMemo(() => {
    return message.content;
  }, [message.id]); // 只在消息 ID 变化时重新计算

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-3xl rounded-2xl px-6 py-4 ${
          message.role === 'user'
            ? 'bg-primary-600 text-white'
            : 'bg-dark-800 text-dark-100'
        }`}
      >
        <div className="text-sm opacity-60 mb-1">
          {message.role === 'user' ? '你' : 'AI 助手'}
        </div>
        <div className="whitespace-pre-wrap">{cachedContent}</div>
      </div>
    </div>
  );
}
