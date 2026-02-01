# Claude Code Hooks - ODDHORSE SITE

This directory contains hooks that run automatically during Claude Code sessions.

## Installed Hooks

### SessionStart
**When it runs:** At the start of every new Claude Code session in this project

**What it does:**
- Checks if Eleventy dev server is running on port 8080
- If not running, starts `npm run serve` in background
- Saves process ID to `.dev-server.pid`
- Waits for server to be ready
- Logs output to `.dev-server.log`

**Why:** Ensures dev server is always available when you start working. No need to manually run `npm run serve` every time.

### SessionEnd
**When it runs:** When a Claude Code session ends in this project

**What it does:**
- Reads dev server PID from `.dev-server.pid`
- Gracefully shuts down the server process
- Cleans up PID file
- (Optional) Cleans up log file

**Why:** Prevents orphaned dev server processes eating resources after you're done.

## Testing Hooks

```bash
# Test SessionStart manually
./.claudehooks/SessionStart

# Check if server started
lsof -Pi :8080 -sTCP:LISTEN

# Check logs
tail -f .dev-server.log

# Test SessionEnd manually
./.claudehooks/SessionEnd

# Verify server stopped
lsof -Pi :8080 -sTCP:LISTEN  # Should return nothing
```

## Troubleshooting

**Server won't start:**
```bash
# Check the log file
cat .dev-server.log

# Manually kill any stuck processes
lsof -ti:8080 | xargs kill -9

# Remove PID file and try again
rm .dev-server.pid
./.claudehooks/SessionStart
```

**Hook not running:**
```bash
# Verify hooks are executable
ls -la .claudehooks/

# Should show: -rwxr-xr-x (executable permission)
# If not, run:
chmod +x .claudehooks/SessionStart .claudehooks/SessionEnd
```

## Generated Files

These files are created/managed by hooks (already in .gitignore):

- `.dev-server.pid` - Process ID of running dev server
- `.dev-server.log` - Server output logs

## Customization

**Change the port:**
Edit the `PORT=8080` line in SessionStart hook.

**Keep logs between sessions:**
Comment out the `rm -f "$LOG_FILE"` line in SessionEnd hook.

**Add pre-flight checks:**
Add npm dependency checks or git status checks to SessionStart.

**Add post-session tasks:**
Add build/test commands to SessionEnd (e.g., `npm run build` before closing).
