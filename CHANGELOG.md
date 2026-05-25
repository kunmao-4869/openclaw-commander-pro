# Changelog

All notable changes to OpenClaw Commander Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Enhanced AI model selection algorithm
- Additional skill templates
- Improved workflow editor UI
- Performance optimizations for large projects

## [2.0.0] - 2026-05-19

### ✨ Added
- **Dual-Model Hybrid Thinking System**
  - Intelligent routing between Qwen3 8B and Qwen3 30B
  - Automatic model selection based on task complexity
  - Manual model switching in UI
  - Memory optimization with auto-unload

- **Plugin-Based Skill System**
  - Dynamic skill loading and hot-reload
  - Permission control and parameter validation
  - 7 core skills:
    - `read_requirement` - Parse requirement documents
    - `safe_read_file` - Secure file reading
    - `safe_list_directory` - Secure directory listing
    - `safe_write_file` - Secure file writing
    - `generate_project_code` - AI-powered code generation
    - `review_code` / `code_review` - Code quality review

- **Visual Workflow Engine**
  - Drag-and-drop workflow editor
  - AI-powered workflow generation
  - Template system with pre-built workflows
  - Execution engine with skill integration

- **Autonomous Agent System**
  - Agent memory and context retention
  - Learning engine for continuous improvement
  - Meta-cognition and self-reflection
  - Advanced reasoning capabilities

- **HarmonyOS Project Generation**
  - ArkTS/ArkUI support
  - MVVM architecture with V2 decorators
  - Navigation architecture
  - Multi-device adaptation (phone, tablet, foldable)

- **Browser Automation**
  - Puppeteer integration
  - Web content learning
  - Automated search and information extraction

- **UI Automation**
  - Mouse and keyboard control
  - Window management
  - Application automation

- **Modern UI/UX**
  - React 18.3.1 + Vite 5.2.0
  - Multi-tab interface
  - Dark theme with glassmorphism
  - Responsive design
  - Smooth animations

### 🔧 Changed
- Migrated from monolithic to microservices architecture
- Separated frontend and backend into distinct processes
- Upgraded to ES Modules throughout the codebase
- Improved error handling and logging
- Enhanced security with skill permissions

### 🐛 Fixed
- File path encoding issues on Windows
- Memory leaks in long-running sessions
- Race conditions in skill execution
- UI freezing during large file operations

### 📚 Documentation
- Comprehensive README with architecture diagrams
- Contributing guidelines
- Code of conduct
- Security policy
- API documentation
- Skill development guide

## [1.0.0] - 2025-XX-XX

### Added
- Initial release of OpenClaw Commander
- Basic skill system
- Simple task planning
- Chat interface

---

## Version History

- **2.0.0** - Complete rewrite with dual-model system (Current)
- **1.0.0** - Initial release

---

## Notation

- `[Unreleased]` - Changes not yet released
- `[2.0.0]` - Version number and release date
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security improvements

For more information on changelog best practices, visit [Keep a Changelog](https://keepachangelog.com).
