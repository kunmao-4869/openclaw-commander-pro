# 🧠 OpenClaw Commander Pro

**AI-Powered Development Assistant | Dual-Model Hybrid Thinking System**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-5.2.0-646cff.svg)](https://vitejs.dev/)

---

## 📖 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Core Skills](#-core-skills)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🧠 Dual-Model Hybrid Thinking System

- **Smart Model Routing**: Automatically selects between Qwen3 8B (fast) and Qwen3 30B (powerful) based on task complexity
- **Manual Switching**: One-click model switch in the UI
- **Memory Optimization**: Automatic model unloading after 1 minute of inactivity

### 🛠️ Plugin-Based Skill System

- **Dynamic Loading**: Hot-reload skills without restarting
- **Permission Control**: Fine-grained access control for each skill
- **Parameter Validation**: Built-in validation and error handling
- **7 Core Skills**:
  - `read_requirement` - Read requirement documents
  - `safe_read_file` - Secure file reading
  - `safe_list_directory` - Secure directory listing
  - `safe_write_file` - Secure file writing
  - `generate_project_code` - AI-powered code generation
  - `review_code` / `code_review` - Code quality review

### ⚙️ Visual Workflow Engine

- **Drag-and-Drop Editor**: Visual workflow creation
- **AI Generation**: Automatically generate workflows from descriptions
- **Template System**: Pre-built workflow templates
- **Execution Engine**: Run workflows with skill integration

### 🤖 Autonomous Agent System

- **Agent Memory**: Long-term memory and context retention
- **Learning Engine**: Continuous improvement from interactions
- **Meta-Cognition**: Self-reflection and optimization
- **Reasoning Engine**: Advanced problem-solving capabilities

### 💻 Terminal Integration

- **Interactive CLI**: Command-line interface with skill execution
- **Real-time Feedback**: Live output and progress tracking
- **Skill Registration**: Dynamic skill discovery and loading

### 🌐 Browser Automation

- **Puppeteer Integration**: Full browser control
- **Web Learning**: Extract and learn from web content
- **Automated Search**: Intelligent web search and information retrieval

### 🎯 HarmonyOS Project Generation

- **ArkTS/ArkUI**: Generate native HarmonyOS projects
- **MVVM Architecture**: Proper architectural patterns
- **V2 Decorators**: @State, @Link, @Prop, @Watch, @ObjectLink
- **Multi-Device Support**: Phone, tablet, foldable screen adaptation

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **Git**: For version control
- **AI Models**: Local Ollama instance with Qwen3 models (8B and 30B)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/openclaw-commander-pro.git
cd openclaw-commander-pro

# Install dependencies
npm install

# Start the backend server
npm run server

# Start the frontend development server (in another terminal)
npm run dev
```

### Access

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3003
- **Health Check**: http://localhost:3003/health

---

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- React 18.3.1
- Vite 5.2.0
- Zustand 4.5.2 (State Management)
- TailwindCSS 3.4.1
- Lucide React (Icons)

**Backend**:
- Node.js + Express 4.22.1
- Puppeteer 24.40.0 (Browser Automation)
- @nut-tree/nut-js 3.1.2 (UI Automation)

**AI Models**:
- Qwen3 8B (Fast responses)
- Qwen3 30B (Powerful reasoning)

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Chat    │  │ Workflow │  │ Terminal │  ...     │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
                        ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────┐
│                 Backend (Express)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Skills  │  │Puppeteer │  │    UI    │          │
│  │   API    │  │  Service │  │Automation│          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│              AI Model Service (Ollama)               │
│         Qwen3 8B          Qwen3 30B                 │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Core Skills

### File Operations
- **read_requirement**: Parse .md requirement documents
- **safe_read_file**: Secure file reading with path validation
- **safe_list_directory**: List directory contents securely
- **safe_write_file**: Write files with permission checks

### Code Generation
- **generate_project_code**: Generate complete projects from requirements
- **review_code**: Code quality analysis and suggestions

### Automation
- **learn_webpage**: Extract knowledge from web pages
- **browser_search**: Automated web search
- **mouse_keyboard_control**: UI automation

---

## 📁 Project Structure

```
openclaw-commander-pro/
├── src/                      # Frontend source code
│   ├── agent/               # AI Agent system
│   ├── ai/                  # AI generators and trainers
│   ├── automation/          # IDE automation
│   ├── components/          # React components
│   ├── lib/                 # Core utilities
│   ├── skills/              # Skill system
│   ├── store/               # Zustand state management
│   ├── terminal/            # Terminal agent
│   ├── workflow/            # Workflow engine
│   └── App.jsx              # Main application
├── server/                   # Backend server
│   ├── routes/              # API routes
│   ├── services/            # Services (Puppeteer, UI)
│   └── index.js             # Server entry
├── Skills/                   # Plugin skills directory
│   ├── general/             # General skills
│   ├── office/              # Office skills
│   ├── programming/         # Programming skills
│   └── security/            # Security skills
├── workflows/                # Workflow definitions
├── docs/                     # Documentation
├── generated/                # Generated projects (gitignored)
└── projects/                 # Example projects
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# AI Model Configuration
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_MODEL=qwen3:8b
ADVANCED_MODEL=qwen3:30b

# Server Configuration
PORT=3003
FRONTEND_PORT=3002

# Optional: API Keys
GITHUB_TOKEN=your_github_token
NOTION_TOKEN=your_notion_token
```

### Model Configuration

Models are configured in `src/lib/openclaw.js`:

```javascript
const modelConfig = {
  'qwen3:8b': {
    timeout: 300000,
    maxTokens: 8192,
    temperature: 0.5
  },
  'qwen3:30b': {
    timeout: 600000,
    maxTokens: 16384,
    temperature: 0.3
  }
}
```

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start frontend dev server
npm run server           # Start backend server
npm run server:all       # Start all servers

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run all tests
npm run test:workflow    # Run workflow tests
npm run test:performance # Run performance tests

# Linting
npm run lint             # Run ESLint
```

### Debugging

1. **Frontend**: Use browser DevTools (F12)
2. **Backend**: Add `debugger` statements and use Node.js inspector
3. **Skills**: Check logs in `server/index.js`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Write tests for new functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenClaw](https://github.com/OpenClaw) - Original project
- [Qwen](https://github.com/QwenLM/Qwen) - AI models
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- All contributors and supporters

---

## 📬 Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/openclaw-commander-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/openclaw-commander-pro/discussions)

---

**Made with ❤️ by the OpenClaw Team**
