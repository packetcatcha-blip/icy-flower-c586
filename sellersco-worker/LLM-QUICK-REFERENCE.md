# Local LLM Quick Reference

## 🚀 Quick Start

### Check What's Running
```powershell
.\scripts\detect-llms.ps1
```

### Start Ollama
```powershell
ollama serve
```

### Start LM Studio
1. Open LM Studio
2. Click "Local Server" tab
3. Enable server on port 1234

## 🤖 Available Models

### Ollama (http://localhost:11434)
| Model | Size | Best For | Speed |
|-------|------|----------|-------|
| GPT-OSS 120B Cloud | 0 GB (remote) | Complex reasoning | Medium |
| GPT-OSS 120B | 60.88 GB | Deep analysis | Slow |
| Devstral 2 | 69.75 GB | Code generation | Medium |
| Llama 3.1 70B | 39.6 GB | General purpose | Fast |

### LM Studio (http://localhost:1234)
| Model | Best For | Speed |
|-------|----------|-------|
| meta/llama-3.3-70b | Latest capabilities | Medium |
| nousresearch/hermes-4-70b | Advanced reasoning | Medium |
| deepseek/deepseek-r1-0528-qwen3-8b | Code-focused | Fast |
| llama-3.2-3b-instruct | Quick tasks | Very Fast |
| pixtral-12b-ollama | Vision + text | Medium |
| text-embedding-nomic-embed-text-v1.5 | Embeddings | Fast |

## 📋 Common Tasks

### Code Completion (Tab Autocomplete)
- **Current:** Llama 3.1 70B (Ollama)
- **How:** Just start typing, press Tab to accept
- **Switch:** Edit `.continue/config.json` → `tabAutocompleteModel`

### Chat with AI
1. Open Continue panel (Ctrl+L or Ctrl+Shift+P → "Continue: Open")
2. Select model from dropdown
3. Ask questions with context:
   ```
   @file src/index.js explain this code
   ```

### Custom Commands
Use `/` commands in Continue:
- `/test` - Generate tests
- `/explain` - Explain code
- `/security` - Security audit
- `/edit` - Edit highlighted code
- `/comment` - Add comments
- `/cmd` - Generate shell commands
- `/commit` - Generate commit message

### Context References
- `@file path/to/file` - Reference a file
- `@folder path/to/dir` - Include directory
- `@docs` - Search Cloudflare docs
- `@codebase` - Full project search
- `@terminal` - Include terminal output
- `@problems` - VS Code errors

## 🎯 Model Selection Guide

### For Code Generation
**Best:** Devstral 2, DeepSeek R1  
**Prompt Example:**
```
Using @file src/index.js as context, create a new endpoint 
for /api/health that returns worker status
```

### For Code Review
**Best:** GPT-OSS 120B, Hermes 4 70B  
**Prompt Example:**
```
Review @folder src/utils for security vulnerabilities,
focus on authentication and input validation
```

### For Quick Fixes
**Best:** Llama 3.2 3B, Llama 3.1 70B  
**Prompt Example:**
```
Fix the syntax error in @file src/auth.js line 42
```

### For Documentation
**Best:** Llama 3.3 70B, GPT-OSS 120B  
**Prompt Example:**
```
Generate comprehensive documentation for @file src/index.js
```

### For Security Analysis
**Best:** Hermes 4 70B, Devstral 2  
**Prompt Example:**
```
/security
Analyze for OWASP Top 10 vulnerabilities
```

## 🔧 Configuration

### Continue Config Location
```
.continue/config.json
```

### Switch Primary Model
1. Open Continue panel
2. Click model dropdown
3. Select from list

### Add Custom Model
Edit `.continue/config.json`:
```json
{
  "models": [
    {
      "title": "My Custom Model",
      "provider": "ollama",
      "model": "model-name:tag",
      "apiBase": "http://localhost:11434",
      "contextLength": 32768
    }
  ]
}
```

## 🐛 Troubleshooting

### Ollama Not Responding
```powershell
# Check if running
Get-Process ollama

# Restart
Stop-Process -Name ollama
ollama serve
```

### LM Studio Not Responding
1. Open LM Studio
2. Go to Local Server tab
3. Toggle server off/on
4. Verify port 1234 is active

### Model Not Found
```bash
# Ollama
ollama list
ollama pull model-name

# LM Studio
# Use GUI to download models
```

### Slow Performance
1. Use smaller models (3B-8B) for quick tasks
2. Close unused applications
3. Check RAM usage (Task Manager)
4. Consider using cloud models for heavy tasks

### Continue Not Connecting
1. Check model API is running:
   ```powershell
   curl http://localhost:11434/api/tags  # Ollama
   curl http://localhost:1234/v1/models  # LM Studio
   ```
2. Reload VS Code: Ctrl+Shift+P → "Reload Window"
3. Check Continue output: View → Output → Continue

## 📊 Performance Tips

### Memory Usage
- **3B models:** ~4GB RAM
- **8B models:** ~8GB RAM
- **70B models:** ~40GB RAM
- **120B models:** ~60GB RAM

### Speed Optimization
1. Keep frequently used models loaded
2. Use appropriate context length
3. Close unused VS Code windows
4. Preload models:
   ```bash
   ollama run llama3.1:70b
   ```

### Context Management
- Smaller context = faster responses
- Use specific `@file` instead of `@codebase`
- Clear chat history periodically

## 🔐 Privacy & Security

### Local-Only Benefits
✅ No data sent to cloud  
✅ No API keys required  
✅ Safe for proprietary code  
✅ No telemetry tracking  
✅ Offline capability  

### Security Commands
```
/security - Analyze for vulnerabilities
```

Focus areas:
- SQL injection
- XSS attacks
- Authentication bypass
- Hardcoded secrets
- OWASP Top 10

## 🔄 Auto-Update Configuration

Run detection script to update Continue config:
```powershell
.\scripts\detect-llms.ps1
```

This will:
1. Detect running Ollama models
2. Detect running LM Studio models
3. Generate updated config at `scripts/detected-llms.json`
4. Show summary of available models

## 📚 Resources

- **Ollama Docs:** <https://ollama.ai/docs>
- **LM Studio:** <https://lmstudio.ai>
- **Continue Docs:** <https://continue.dev/docs>
- **Cloudflare AI:** <https://developers.cloudflare.com/workers-ai/>

## 🎨 VS Code Integration

### Keyboard Shortcuts
- `Ctrl+L` - Open Continue chat
- `Ctrl+Shift+P` - Command palette
- `Tab` - Accept autocomplete
- `Esc` - Dismiss autocomplete

### Status Indicators
- 🟢 Model connected
- 🟡 Model loading
- 🔴 Model offline

---

**Last Updated:** December 14, 2025  
**Auto-detection:** Run `.\scripts\detect-llms.ps1`
