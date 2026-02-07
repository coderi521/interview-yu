### 1、传输：
- 采用 SSE 或 WebSocket
- **尽量对齐 AG-UI 事件模型**（即使一开始不全实现 16 种事件）
	- ![[Pasted image 20260204133024.png]]
### **事件格式建议**
 - 至少支持：
    - `RunStarted` / `RunFinished` / `RunError`
    - `TextMessageStart` / `TextMessageContent` / `TextMessageEnd`
    - `ToolCallStart` / `ToolCallResult`
    - `StateDelta`（可选，用于复杂 UI 状态）
```
 // SSE / WebSocket 消息 data:
{
  "type": "TextMessageContent",
  "payload": {
    "messageId": "msg-001",
    "role": "assistant",
    "delta": "你好，我是你的旅行助手。"
  }
}
```
前端只需根据 `type` 做 `switch` 分发即可。
如果你考虑与外部 Agent 平台集成（Anthropic/OpenAI 等），则直接：
    
    - 封装为 **MCP Server**，让 Agent 通过 MCP 调用你的服务