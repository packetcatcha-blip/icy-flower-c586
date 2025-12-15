# Local LLM Setup for VS Code

This guide explains how to use local LLMs with VS Code for code completion, chat, and other AI features.

## Overview

The workspace is configured to work with **Continue** extension for local LLM integration. Continue supports:
- **Ollama** - Easy local LLM hosting (recommended)
- **LM Studio** - GUI-based local LLM management
- **OpenAI API** - Cloud-based fallback option

## Prerequisites

### Install Continue Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Continue"
4. Install "Continue - Codestral, Claude, and more"

### Install Ollama (Recommended)

**Windows:**
```powershell
# Download and install from https://ollama.ai/download
winget install Ollama.Ollama
```

**Verify installation:**
```powershell
ollama --version
```

### Install Recommended Models

**For code completion (lightweight):**
```bash
ollama pull codellama:7b
```

**For chat/general use:**
```bash
ollama pull llama3.2:latest
```

**For embeddings (semantic search):**
```bash
ollama pull nomic-embed-text
```

**Check running models:**
```bash
ollama list
ollama ps
```

## Configuration Files

### .continue/config.json
Located in each workspace folder with the following configurations:

#### Models Array
- **Ollama (Local)** - `codellama:7b` on `http://localhost:11434`
- **Ollama Llama 3.2** - `llama3.2:latest` for better chat
- **LM Studio** - Local models on `http://localhost:1234/v1`
- **OpenAI GPT-4** - Cloud fallback (requires API key)

#### Tab Autocomplete
Uses `codellama:7b` via Ollama for fast code suggestions.

#### Embeddings Provider
Uses `nomic-embed-text` for semantic code search.

### .vscode/settings.json
Contains Continue-specific settings:
```json
{
  "continue.enableTabAutocomplete": true,
  "cline.allowFileEdits": true
}
```

## Using Continue with Local LLMs

### Tab Autocomplete
1. Start typing code
2. Continue suggests completions (powered by `codellama:7b`)
3. Press Tab to accept suggestion
4. Press Esc to dismiss

### Chat Interface
1. Open Continue sidebar (Ctrl+Shift+P → "Continue: Open")
2. Select model from dropdown (Ollama options)
3. Ask questions about your code
4. Use `@` to reference files/folders
5. Use `/` for slash commands

### Custom Commands
Pre-configured commands available:
- `/test` - Generate comprehensive tests
- `/explain` - Explain code in detail
- `/security` - Security vulnerability analysis
- `/edit` - Edit highlighted code
- `/comment` - Add code comments
- `/cmd` - Generate shell commands
- `/commit` - Generate commit messages

### Context Providers
Continue can access:
- **code** - Current file/selection
- **docs** - Cloudflare Workers/Wrangler docs
- **diff** - Git changes
- **terminal** - Terminal output
- **problems** - VS Code diagnostics
- **folder** - Workspace files
- **codebase** - Full project context

## Troubleshooting

### Ollama Not Running
```powershell
# Check if Ollama service is running
Get-Process ollama -ErrorAction SilentlyContinue

# Start Ollama (if not running)
ollama serve
```

### Model Not Found
```bash
# List installed models
ollama list

# Pull missing model
ollama pull codellama:7b
```

### Continue Not Connecting
1. Verify Ollama is running: `http://localhost:11434`
2. Check Continue settings in VS Code
3. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
4. Check Continue logs: View → Output → Continue

### Slow Performance
- Use smaller models (`codellama:7b` instead of `codellama:34b`)
- Reduce context window in Continue settings
- Close unused applications to free RAM
- Consider GPU acceleration if available

### Alternative: LM Studio

If you prefer a GUI:

1. Download LM Studio: https://lmstudio.ai/
2. Install and launch LM Studio
3. Download a model (e.g., CodeLlama, Llama 3.2)
4. Start local server (default: `http://localhost:1234`)
5. Continue will auto-detect LM Studio models

## Best Practices

### Model Selection
- **Code completion** - Use `codellama:7b` (fast, accurate)
- **Chat/explanations** - Use `llama3.2:latest` (better reasoning)
- **Embeddings** - Use `nomic-embed-text` (optimized for code)

### Performance Optimization
- Keep Ollama running in background
- Preload frequently used models: `ollama run codellama:7b`
- Close models when not in use: `ollama stop codellama:7b`

### Privacy
- All data stays local (no cloud API calls)
- No telemetry sent (`"allowAnonymousTelemetry": false`)
- Safe for proprietary/sensitive code

### Context Management
- Use `@file` to reference specific files
- Use `@folder` for directory context
- Use `@docs` for Cloudflare documentation
- Keep conversations focused to reduce token usage

## Security Considerations

### Custom Security Command
Use `/security` command to analyze code for:
- SQL injection vulnerabilities
- XSS attack vectors
- Authentication bypasses
- Insecure dependencies
- Hardcoded secrets
- OWASP Top 10 issues

### Example Usage
```javascript
// Highlight this code and run /security
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

Continue will identify SQL injection risk and suggest parameterized queries.

## Integration with Cloudflare Workers

### Documentation Context
Pre-configured documentation sources:
- Cloudflare Workers API
- Wrangler CLI reference
- Workers AI/Vectorize docs

### Example Prompts
- "How do I use R2 bindings in Workers?"
- "Show me Vectorize query syntax"
- "Generate D1 database migration SQL"
- "Explain Workers AI embeddings API"

### Project-Specific Context
Continue has access to:
- `copilot-instructions.md` - Architecture patterns
- `wrangler.jsonc` - Binding configurations
- `src/index.js` - Worker implementation
- `test/` - Test examples

## Advanced Configuration

### Adding New Models
Edit `.continue/config.json`:
```json
{
  "models": [
    {
      "title": "My Custom Model",
      "provider": "ollama",
      "model": "model-name:tag",
      "apiBase": "http://localhost:11434"
    }
  ]
}
```

### Custom Commands
Add to `customCommands` array:
```json
{
  "name": "optimize",
  "prompt": "Optimize this code for performance and readability",
  "description": "Code optimization"
}
```

### Temperature/Sampling
Adjust in model config:
```json
{
  "model": "codellama:7b",
  "apiBase": "http://localhost:11434",
  "temperature": 0.2,  // Lower = more deterministic
  "topP": 0.95
}
```

## Resources

- **Ollama Docs** - https://ollama.ai/docs
- **Continue Docs** - https://continue.dev/docs
- **LM Studio** - https://lmstudio.ai/docs
- **Model Library** - https://ollama.ai/library
- **Cloudflare AI** - https://developers.cloudflare.com/workers-ai/

## Quick Reference

### Start Ollama
```powershell
ollama serve
```

### List Models
```bash
ollama list
```

### Run Model
```bash
ollama run codellama:7b
```

### Stop Model
```bash
ollama stop codellama:7b
```

### Check Status
```bash
ollama ps
```

### Test API
```powershell
curl http://localhost:11434/api/tags
```

---

**Last Updated:** December 14, 2025  
**Maintainer:** James Sellers (jsellers@nexuminc.com)
