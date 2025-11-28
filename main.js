<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <title>Terminal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        :root {
            --bg: #000000;
            --fg: #ffffff;
            --prompt: #ffffff;
            --banner: #888888;
        }

        body {
            font-family: 'Courier New', 'Courier', monospace;
            font-size: 14px;
            background: var(--bg);
            color: var(--fg);
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
            position: fixed;
            width: 100%;
            transition: background 0.3s, color 0.3s;
        }

        body.futuristic {
            --bg: #0d1117;
            --fg: #c9d1d9;
            --prompt: #58a6ff;
            --banner: #8b949e;
            background: #0d1117;
            animation: bgPulse 8s ease-in-out infinite;
        }

        @keyframes bgPulse {
            0%, 100% { background: #0d1117; }
            50% { background: #161b22; }
        }

        body.futuristic::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(88, 166, 255, 0.03),
                rgba(88, 166, 255, 0.03) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 1000;
            animation: scanline 8s linear infinite;
        }

        body.futuristic::after {
            content: '';
            position: fixed;
            top: -100%;
            left: 0;
            width: 100%;
            height: 200%;
            background: linear-gradient(
                180deg,
                transparent 0%,
                rgba(88, 166, 255, 0.05) 50%,
                transparent 100%
            );
            pointer-events: none;
            z-index: 999;
            animation: sweep 4s ease-in-out infinite;
        }

        @keyframes sweep {
            0% { transform: translateY(0); }
            100% { transform: translateY(50%); }
        }

        @keyframes scanline {
            0% { transform: translateY(0); }
            100% { transform: translateY(100%); }
        }

        body.futuristic .output-line {
            animation: textGlow 0.15s ease-out, textSlide 0.2s ease-out;
        }

        @keyframes textGlow {
            0% { 
                opacity: 0;
                text-shadow: 0 0 20px rgba(88, 166, 255, 0.8);
            }
            100% { 
                opacity: 1;
                text-shadow: 0 0 2px rgba(88, 166, 255, 0.3);
            }
        }

        @keyframes textSlide {
            0% {
                transform: translateX(-5px);
                filter: blur(2px);
            }
            100% {
                transform: translateX(0);
                filter: blur(0);
            }
        }

        .terminal-container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .terminal-output {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
            font-size: 13px;
            line-height: 1.3;
            -webkit-overflow-scrolling: touch;
            font-family: monospace;
        }

        .terminal-output::-webkit-scrollbar {
            width: 0;
        }

        .output-line {
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .terminal-input-line {
            display: flex;
            padding: 8px;
            background: var(--bg);
            transition: opacity 0.2s;
        }

        .prompt {
            color: var(--prompt);
            margin-right: 4px;
            white-space: nowrap;
            transition: color 0.3s;
        }

        body.futuristic .prompt {
            text-shadow: 0 0 10px rgba(88, 166, 255, 0.8), 0 0 20px rgba(88, 166, 255, 0.4);
            animation: promptPulse 2s ease-in-out infinite;
        }

        @keyframes promptPulse {
            0%, 100% { text-shadow: 0 0 10px rgba(88, 166, 255, 0.8), 0 0 20px rgba(88, 166, 255, 0.4); }
            50% { text-shadow: 0 0 15px rgba(88, 166, 255, 1), 0 0 30px rgba(88, 166, 255, 0.6); }
        }

        body.futuristic .banner {
            text-shadow: 0 0 5px rgba(139, 148, 158, 0.5);
        }

        #terminalInput {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--fg);
            font-family: monospace;
            font-size: 13px;
            outline: none;
            caret-color: var(--fg);
            transition: color 0.3s;
            position: relative;
            z-index: 2;
        }

        .hint-text {
            position: absolute;
            left: 0;
            top: 0;
            color: var(--fg);
            opacity: 0.3;
            font-family: monospace;
            font-size: 13px;
            pointer-events: none;
            white-space: pre;
            z-index: 1;
        }

        .cursor {
            display: inline-block;
            width: 7px;
            height: 14px;
            background: var(--fg);
            margin-left: 1px;
            animation: blink 1s step-end infinite;
        }

        @keyframes blink {
            50% { opacity: 0; }
        }

        .banner {
            color: var(--banner);
            transition: color 0.3s;
        }

        body.futuristic .banner {
            text-shadow: 0 0 5px rgba(180, 167, 214, 0.3);
        }

        body.futuristic .output-line {
            text-shadow: 0 0 1px rgba(180, 167, 214, 0.2);
        }

        .loading-indicator {
            display: inline-block;
            animation: loadingDots 1.5s infinite;
        }

        @keyframes loadingDots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
    </style>
</head>
<body>
    <div class="terminal-container">
        <div class="terminal-output" id="output"></div>
        <div class="terminal-input-line" id="inputLine">
            <span class="prompt" id="promptText">user@kali:~$</span>
            <div style="position: relative; flex: 1;">
                <div id="hintText" class="hint-text"></div>
                <input 
                    type="text" 
                    id="terminalInput" 
                    autocomplete="off" 
                    autocorrect="off" 
                    autocapitalize="off" 
                    spellcheck="false"
                >
            </div>
        </div>
    </div>

    <script>
        const WELCOME = `╔══════════════════════════════════════════════════════════╗
║                                                          ║
║              Welcome to MetaSim v1.0                     ║
║        Educational Penetration Testing Simulation        ║
║                                                          ║
║  This is a training environment for learning ethical     ║
║  hacking workflows. No real attacks are performed.       ║
║                                                          ║
║  Type commands as you would in a real terminal.          ║
║  Start with: nmap -sV 10.10.10.10                        ║
║                                                          ║
║  Type 'theme' to toggle futuristic mode                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`;

        class Terminal {
            constructor() {
                this.step = 0;
                this.msfMode = false;
                this.shellMode = false;
                this.currentModule = 0;
                this.currentDir = '/root';
                this.commandHistory = [];
                this.historyIndex = -1;
                this.output = document.getElementById('output');
                this.input = document.getElementById('terminalInput');
                this.promptText = document.getElementById('promptText');
                this.inputLine = document.getElementById('inputLine');
                this.isProcessing = false;
                this.futuristicMode = false;
                this.nmapScanning = false;
                this.nmapProgress = 0;
                this.nmapStartTime = 0;
                this.nmapTotalTime = 0;
                this.hintTimeout = null;
                this.lastInputTime = Date.now();
                
                this.init();
            }

            init() {
                this.hintText = document.getElementById('hintText');
                this.printInstant(WELCOME, 'banner');
                this.setupEventListeners();
                this.input.focus();
                this.startHintTimer();
            }

            setupEventListeners() {
                this.input.addEventListener('keydown', (e) => {
                    if (this.isProcessing) {
                        e.preventDefault();
                        return;
                    }

                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleCommand();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        this.navigateHistory(-1);
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        this.navigateHistory(1);
                    } else if (e.key === 'Tab') {
                        e.preventDefault();
                        this.autocomplete();
                    }
                });

                this.input.addEventListener('input', () => {
                    this.updateHint();
                    this.startHintTimer();
                });

                this.output.addEventListener('DOMNodeInserted', () => {
                    this.scrollToBottom();
                });
            }

            updatePrompt() {
                if (this.shellMode) {
                    this.promptText.textContent = '';
                } else if (this.msfMode) {
                    if (this.step >= 4 && this.currentModule >= 0) {
                        // Show exploit name in prompt based on which module is loaded
                        const moduleNames = [
                            'vsftpd_234_backdoor',
                            'vsftpd_auth_bypass', 
                            'vsftpd_download_exec'
                        ];
                        this.promptText.textContent = `msf6 exploit(unix/ftp/${moduleNames[this.currentModule]}) >`;
                    } else {
                        // Generic msf6 prompt before selecting exploit or after back
                        this.promptText.textContent = 'msf6 >';
                    }
                } else {
                    this.promptText.textContent = 'user@kali:~$';
                }
            }

            lockInput() {
                this.isProcessing = true;
                this.input.disabled = true;
                this.inputLine.style.opacity = '0.5';
                this.hideHint();
            }

            unlockInput() {
                this.isProcessing = false;
                this.input.disabled = false;
                this.inputLine.style.opacity = '1';
                this.input.focus();
                this.startHintTimer();
            }

            printInstant(text, className = '') {
                const lines = text.split('\n');
                lines.forEach(line => {
                    const div = document.createElement('div');
                    div.className = `output-line ${className}`;
                    div.textContent = line;
                    this.output.appendChild(div);
                });
                this.scrollToBottom();
            }

            async printLine(text, delay = 0) {
                if (delay > 0) {
                    await this.sleep(delay);
                }
                const div = document.createElement('div');
                div.className = 'output-line';
                div.textContent = text;
                this.output.appendChild(div);
                this.scrollToBottom();
            }

            sleep(ms) {
                // Add random variation to sleep times for realism (±20%)
                const variation = ms * 0.2;
                const randomMs = ms + (Math.random() * variation * 2 - variation);
                return new Promise(resolve => setTimeout(resolve, randomMs));
            }

            printCommand(cmd) {
                const div = document.createElement('div');
                div.className = 'output-line';
                div.textContent = this.promptText.textContent + ' ' + cmd;
                this.output.appendChild(div);
                this.scrollToBottom();
            }

            scrollToBottom() {
                setTimeout(() => {
                    this.output.scrollTop = this.output.scrollHeight;
                }, 10);
            }

            showHelp() {
                const helpMessages = {
                    0: `[NEXT STEP]
Run an Nmap scan to identify services on the target:
  nmap -sV 10.10.10.10`,
                    1: `[NEXT STEP]
Start the Metasploit Framework:
  msfconsole`,
                    2: `[NEXT STEP]
Search for the vsftpd exploit module:
  search vsftpd`,
                    3: `[NEXT STEP]
Load the vsftpd backdoor exploit (choose the one with "excellent" rank):
  use 0
  or
  use exploit/unix/ftp/vsftpd_234_backdoor`,
                    4: `[NEXT STEP]
Set the target IP address (you can skip 'show options'):
  set RHOSTS 10.10.10.10
  
Or view the module options first:
  show options`,
                    5: `[NEXT STEP]
Set the target IP address (use RHOSTS, not RHOST):
  set RHOSTS 10.10.10.10`,
                    6: `[NEXT STEP]
Launch the exploit:
  exploit
  or
  run`,
                    7: `[EXPLOITATION COMPLETE]
You now have a root shell on the target system.
Try commands like:
  id
  whoami
  uname -a
  ls
  cat /etc/passwd
  
Type 'exit' to return to Metasploit.`
                };
                
                this.printInstant(helpMessages[this.step] || 'Type commands as you would in a real terminal.');
            }

            getNextCommand() {
                const commands = {
                    0: 'nmap -sV 10.10.10.10',
                    1: 'msfconsole',
                    2: 'search vsftpd',
                    3: 'use 0',
                    4: 'set RHOSTS 10.10.10.10',
                    5: 'set RHOSTS 10.10.10.10',
                    6: 'exploit',
                    7: 'cd Downloads'
                };
                return commands[this.step] || '';
            }

            getHintText() {
                const hints = {
                    0: 'nmap -sV 10.10.10.10',
                    1: 'msfconsole',
                    2: 'search vsftpd',
                    3: 'Select an exploit! use [exploit number] example: use 1',
                    4: 'set RHOSTS 10.10.10.10',
                    5: 'set RHOSTS 10.10.10.10',
                    6: 'exploit',
                    7: 'cd Downloads'
                };
                return hints[this.step] || '';
            }

            autocomplete() {
                const nextCmd = this.getNextCommand();
                if (nextCmd) {
                    this.input.value = nextCmd;
                    this.hideHint();
                }
            }

            startHintTimer() {
                if (this.hintTimeout) {
                    clearTimeout(this.hintTimeout);
                }
                // Don't start timer if processing or scanning
                if (this.isProcessing || this.nmapScanning) {
                    return;
                }
                this.hintTimeout = setTimeout(() => {
                    this.updateHint();
                }, 4000);
            }

            updateHint() {
                const hintText = this.getHintText();
                const nextCmd = this.getNextCommand();
                const currentValue = this.input.value;
                
                if (!hintText || this.isProcessing || this.nmapScanning) {
                    this.hideHint();
                    return;
                }

                // Step 3 is instructional - show full hint, not insert mode
                if (this.step === 3) {
                    if (!currentValue) {
                        this.hintText.textContent = hintText;
                        this.hintText.style.paddingLeft = '0';
                    } else {
                        this.hideHint();
                    }
                    return;
                }

                // Show only the remaining part of the command (insert mode behavior)
                if (nextCmd && nextCmd.startsWith(currentValue)) {
                    const remaining = nextCmd.substring(currentValue.length);
                    this.hintText.textContent = remaining;
                    // Position hint text to start right after the typed text
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    context.font = '13px monospace';
                    const textWidth = context.measureText(currentValue).width;
                    this.hintText.style.paddingLeft = textWidth + 'px';
                } else {
                    this.hideHint();
                }
            }

            showHint() {
                this.updateHint();
            }

            hideHint() {
                this.hintText.textContent = '';
                this.hintText.style.paddingLeft = '0';
                if (this.hintTimeout) {
                    clearTimeout(this.hintTimeout);
                }
            }

            toggleTheme() {
                this.futuristicMode = !this.futuristicMode;
                if (this.futuristicMode) {
                    document.body.classList.add('futuristic');
                    this.printInstant('Theme changed to: FUTURISTIC');
                } else {
                    document.body.classList.remove('futuristic');
                    this.printInstant('Theme changed to: CLASSIC');
                }
            }

            async handleCommand() {
                const cmd = this.input.value.trim();
                
                // If nmap is scanning and user hits enter, show progress
                if (this.nmapScanning && !cmd) {
                    const elapsed = Date.now() - this.nmapStartTime;
                    const progress = Math.min(Math.floor((elapsed / this.nmapTotalTime) * 100), 99);
                    this.nmapProgress = progress;
                    this.printCommand('');
                    await this.printLine(`Stats: 0:${Math.floor(elapsed/1000).toString().padStart(2, '0')} elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan`);
                    await this.printLine(`Service scan Timing: About ${progress}.00% done`);
                    this.input.value = '';
                    return;
                }
                
                this.printCommand(cmd);
                this.commandHistory.push(cmd);
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';

                if (!cmd) return;

                // Check for theme command
                if (cmd.toLowerCase() === 'theme') {
                    this.toggleTheme();
                    return;
                }

                this.lockInput();
                await this.processCommand(cmd);
                this.unlockInput();
            }

            async processCommand(cmd) {
                const lower = cmd.toLowerCase();

                // Exit handling
                if (lower === 'exit' || lower === 'quit') {
                    if (this.shellMode) {
                        await this.printLine('exit');
                        this.shellMode = false;
                        this.msfMode = true;
                        this.updatePrompt();
                        return;
                    } else if (this.msfMode) {
                        this.msfMode = false;
                        this.updatePrompt();
                        return;
                    } else {
                        await this.printLine('logout');
                        this.input.disabled = true;
                        return;
                    }
                }

                // Clear
                if (lower === 'clear') {
                    this.output.innerHTML = '';
                    return;
                }

                // Help
                if (lower === 'help') {
                    this.showHelp();
                    return;
                }

                // Step-based logic
                await this.handleStepCommand(cmd, lower);
            }

            async handleStepCommand(cmd, lower) {
                switch (this.step) {
                    case 0: // Nmap
                        if (lower.startsWith('nmap')) {
                            await this.runNmapScan();
                            this.step = 1;
                        } else {
                            await this.printLine(`bash: ${cmd}: command not found`);
                        }
                        break;

                    case 1: // Start Metasploit or run nmap again
                        if (lower === 'msfconsole') {
                            await this.startMetasploit();
                            this.msfMode = true;
                            this.step = 2;
                            this.updatePrompt();
                        } else if (lower.startsWith('nmap')) {
                            await this.runNmapScan();
                        } else {
                            await this.printLine(`bash: ${cmd}: command not found`);
                        }
                        break;

                    case 2: // Search
                        if (!this.msfMode) {
                            await this.printLine(`bash: ${cmd}: command not found`);
                        } else if (lower.startsWith('search') && lower.includes('vsftpd')) {
                            await this.searchModules();
                            this.step = 3;
                        } else if (lower.startsWith('search')) {
                            await this.printLine('');
                            await this.printLine('Matching Modules');
                            await this.printLine('================');
                            await this.printLine('');
                        } else {
                            await this.printLine(`[-] Unknown command: ${cmd}.`);
                        }
                        break;

                    case 3: // Use module or search again
                        if (!this.msfMode) {
                            await this.printLine(`bash: ${cmd}: command not found`);
                        } else if (lower.startsWith('use') && (lower.includes('vsftpd_234_backdoor') || lower.includes('use 0'))) {
                            this.step = 4;
                            this.currentModule = 0;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('1') || lower.includes('auth_bypass'))) {
                            this.step = 4;
                            this.currentModule = 1;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('2') || lower.includes('download_exec'))) {
                            this.step = 4;
                            this.currentModule = 2;
                            this.updatePrompt();
                        } else if (lower.startsWith('search') && lower.includes('vsftpd')) {
                            await this.searchModules();
                        } else if (lower.startsWith('search')) {
                            await this.printLine('');
                            await this.printLine('Matching Modules');
                            await this.printLine('================');
                            await this.printLine('');
                        } else if (lower.startsWith('use')) {
                            await this.printLine('[-] Invalid module');
                        } else {
                            await this.printLine(`[-] Unknown command: ${cmd}.`);
                        }
                        break;

                    case 4: // Show options or set RHOSTS directly
                        if (!this.msfMode) {
                            await this.printLine(`bash: ${cmd}: command not found`);
                        } else if (lower === 'back') {
                            // Go back to search results
                            this.step = 3;
                            this.currentModule = -1;
                            this.updatePrompt();
                        } else if (lower === 'show options' || lower === 'options') {
                            await this.showOptions();
                            this.step = 5;
                        } else if (lower.startsWith('set rhosts')) {
                            if (lower.includes('10.10.10.10')) {
                                await this.printLine('RHOSTS => 10.10.10.10');
                                this.step = 6;
                            } else {
                                const ip = cmd.split(/\s+/)[2];
                                await this.printLine(`RHOSTS => ${ip}`);
                                this.step = 6;
                            }
                        } else if (lower.startsWith('set')) {
                            const parts = cmd.split(/\s+/);
                            if (parts.length >= 3) {
                                await this.printLine(`${parts[1]} => ${parts.slice(2).join(' ')}`);
                            }
                        } else if (lower.startsWith('use') && (lower.includes('vsftpd_234_backdoor') || lower.includes('use 0'))) {
                            this.currentModule = 0;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('1') || lower.includes('auth_bypass'))) {
                            this.currentModule = 1;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('2') || lower.includes('download_exec'))) {
                            this.currentModule = 2;
                            this.updatePrompt();
                        } else if (lower.startsWith('search') && lower.includes('vsftpd')) {
                            await this.searchModules();
                        } else if (lower.startsWith('show')) {
                            await this.printLine('');
                        } else {
                            await this.printLine(`[-] Unknown command: ${cmd}.`);
                        }
                        break;

                    case 5: // Set RHOSTS or show options again
                        if (!this.msfMode) {
                            await this.printLine(`bash: ${cmd}: command not found`);
                        } else if (lower === 'back') {
                            // Go back to search results
                            this.step = 3;
                            this.currentModule = -1;
                            this.updatePrompt();
                        } else if (lower.startsWith('set rhosts')) {
                            if (lower.includes('10.10.10.10')) {
                                await this.printLine('RHOSTS => 10.10.10.10');
                                this.step = 6;
                            } else {
                                const ip = cmd.split(/\s+/)[2];
                                await this.printLine(`RHOSTS => ${ip}`);
                            }
                        } else if (lower.startsWith('set')) {
                            const parts = cmd.split(/\s+/);
                            if (parts.length >= 3) {
                                await this.printLine(`${parts[1]} => ${parts.slice(2).join(' ')}`);
                            }
                        } else if (lower === 'show options' || lower === 'options') {
                            await this.showOptions();
                        } else if (lower.startsWith('use') && (lower.includes('vsftpd_234_backdoor') || lower.includes('use 0'))) {
                            this.currentModule = 0;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('1') || lower.includes('auth_bypass'))) {
                            this.currentModule = 1;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('2') || lower.includes('download_exec'))) {
                            this.currentModule = 2;
                            this.updatePrompt();
                        } else {
                            await this.printLine(`[-] Unknown command: ${cmd}.`);
                        }
                        break;

                    case 6: // Exploit or continue setting options
                        if (!this.msfMode) {
                            await this.printLine(`bash: ${cmd}: command not found`);
                        } else if (lower === 'back') {
                            // Go back to search results
                            this.step = 3;
                            this.currentModule = -1;
                            this.updatePrompt();
                        } else if (lower === 'exploit' || lower === 'run') {
                            if (this.currentModule === 0) {
                                // Correct module - run successful exploit
                                await this.runExploit();
                                this.shellMode = true;
                                this.msfMode = false;
                                this.step = 7;
                                this.updatePrompt();
                            } else if (this.currentModule === 1) {
                                // Auth bypass module - fails
                                await this.runFailedExploit1();
                            } else if (this.currentModule === 2) {
                                // Download exec module - fails
                                await this.runFailedExploit2();
                            }
                        } else if (lower.startsWith('set')) {
                            const parts = cmd.split(/\s+/);
                            if (parts.length >= 3) {
                                await this.printLine(`${parts[1]} => ${parts.slice(2).join(' ')}`);
                            }
                        } else if (lower === 'show options' || lower === 'options') {
                            await this.showOptionsWithRHOSTS();
                        } else if (lower.startsWith('use') && (lower.includes('vsftpd_234_backdoor') || lower.includes('use 0'))) {
                            this.currentModule = 0;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('1') || lower.includes('auth_bypass'))) {
                            this.currentModule = 1;
                            this.updatePrompt();
                        } else if (lower.startsWith('use') && (lower.includes('2') || lower.includes('download_exec'))) {
                            this.currentModule = 2;
                            this.updatePrompt();
                        } else {
                            await this.printLine(`[-] Unknown command: ${cmd}.`);
                        }
                        break;

                    case 7: // Shell
                        if (this.shellMode) {
                            await this.handleShellCommand(cmd, lower);
                        } else {
                            await this.printLine(`[-] Unknown command: ${cmd}.`);
                        }
                        break;

                    default:
                        await this.printLine(`bash: ${cmd}: command not found`);
                }
            }

            async runNmapScan() {
                // Nmap shows initial message, then waits, then dumps everything at once
                await this.printLine('Starting Nmap 7.94 ( https://nmap.org ) at 2025-11-25 13:00 CST');
                await this.printLine('Please wait while Nmap is scanning... (Press Enter to view progress)');
                
                // Set scanning state
                this.nmapScanning = true;
                this.nmapStartTime = Date.now();
                this.nmapTotalTime = 5200 + Math.random() * 5200; // 5.2-10.4 seconds (30% longer)
                this.nmapProgress = 0;
                
                // Temporarily unlock input so user can hit enter to see progress
                this.unlockInput();
                
                // Simulate scanning delay with realistic variation
                await this.sleep(this.nmapTotalTime);
                
                // Lock input again and finish scan
                this.lockInput();
                this.nmapScanning = false;
                
                // Then dump all results at once
                await this.printLine('Nmap scan report for 10.10.10.10');
                await this.printLine('Host is up (0.00021s latency).');
                await this.printLine('Not shown: 997 filtered tcp ports (no-response)');
                await this.printLine('PORT   STATE SERVICE VERSION');
                await this.printLine('21/tcp open  ftp     vsftpd 2.3.4');
                await this.printLine('22/tcp open  ssh     OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)');
                await this.printLine('80/tcp open  http    Apache httpd 2.2.8 ((Ubuntu) DAV/2)');
                await this.printLine('Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel');
                await this.printLine('');
                await this.printLine('Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .');
                await this.printLine('Nmap done: 1 IP address (1 host up) scanned in 11.78 seconds');
                await this.printLine('');
                await this.printLine('TIP: Notice the FTP service running vsftpd 2.3.4 - search for this in Metasploit!');
            }

            async startMetasploit() {
                // Show loading message
                const loadingLine = document.createElement('div');
                loadingLine.className = 'output-line';
                loadingLine.textContent = 'Loading Metasploit Framework...';
                this.output.appendChild(loadingLine);
                this.scrollToBottom();
                
                // Simulate loading time with variation (1.5-4 seconds)
                const loadTime = 1500 + Math.random() * 2500;
                await this.sleep(loadTime);
                
                await this.printLine('');
                await this.printLine('                                                  ');
                await this.printLine('       =[ metasploit v6.3.55-dev                          ]');
                await this.printLine('+ -- --=[ 2397 exploits - 1234 auxiliary - 413 post       ]');
                await this.printLine('+ -- --=[ 1391 payloads - 46 encoders - 11 nops           ]');
                await this.printLine('+ -- --=[ 9 evasion                                       ]');
                await this.printLine('');
                await this.printLine('Metasploit tip: After running db_nmap, be sure to check out the result of hosts');
                await this.printLine('and services');
                await this.printLine('');
                await this.printLine('Metasploit Documentation: https://docs.metasploit.com/');
                await this.printLine('');
            }

            async searchModules() {
                await this.printLine('');
                await this.sleep(800);
                await this.printLine('Matching Modules');
                await this.printLine('================');
                await this.printLine('');
                await this.printLine('   #  Name                                  Disclosure Date  Rank       Check  Description');
                await this.printLine('   -  ----                                  ---------------  ----       -----  -----------');
                await this.printLine('   0  exploit/unix/ftp/vsftpd_234_backdoor  2011-07-03       excellent  No     VSFTPD v2.3.4 Backdoor Command Execution');
                await this.printLine('   1  exploit/unix/ftp/vsftpd_auth_bypass   2010-04-08       normal     Yes    VSFTPD Authentication Bypass');
                await this.printLine('   2  exploit/unix/ftp/vsftpd_download_exec 2011-02-14       good       No     VSFTPD Download Command Execution');
                await this.printLine('');
                await this.printLine('');
                await this.printLine('Interact with a module by name or index. For example info 0, use 0 or use exploit/unix/ftp/vsftpd_234_backdoor');
            }

            async showOptions() {
                await this.printLine('');
                await this.printLine('Module options (exploit/unix/ftp/vsftpd_234_backdoor):');
                await this.printLine('');
                await this.printLine('   Name    Current Setting  Required  Description');
                await this.printLine('   ----    ---------------  --------  -----------');
                await this.printLine('   RHOSTS                   yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html');
                await this.printLine('   RPORT   21               yes       The target port (TCP)');
                await this.printLine('');
                await this.printLine('');
                await this.printLine('Exploit target:');
                await this.printLine('');
                await this.printLine('   Id  Name');
                await this.printLine('   --  ----');
                await this.printLine('   0   Automatic');
                await this.printLine('');
            }

            async showOptionsWithRHOSTS() {
                await this.printLine('');
                await this.printLine('Module options (exploit/unix/ftp/vsftpd_234_backdoor):');
                await this.printLine('');
                await this.printLine('   Name    Current Setting  Required  Description');
                await this.printLine('   ----    ---------------  --------  -----------');
                await this.printLine('   RHOSTS  10.10.10.10      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html');
                await this.printLine('   RPORT   21               yes       The target port (TCP)');
                await this.printLine('');
                await this.printLine('');
                await this.printLine('Exploit target:');
                await this.printLine('');
                await this.printLine('   Id  Name');
                await this.printLine('   --  ----');
                await this.printLine('   0   Automatic');
                await this.printLine('');
            }

            async runExploit() {
                // First 3 - slow (1-3 seconds each)
                await this.printLine('[*] Started reverse TCP handler on 192.168.1.100:4444');
                await this.sleep(1000 + Math.random() * 2000);
                await this.printLine('[*] 10.10.10.10:21 - Attempting to connect to FTP service...');
                await this.sleep(1000 + Math.random() * 2000);
                await this.printLine('[*] 10.10.10.10:21 - Connected to target FTP server');
                await this.sleep(1000 + Math.random() * 2000);
                
                // Next 2 - instant
                await this.printLine('[*] 10.10.10.10:21 - Banner: 220 (vsFTPd 2.3.4)');
                await this.printLine('[*] 10.10.10.10:21 - Sending username with trigger...');
                
                // Next 4 - less slow (500ms-1.5s each)
                await this.sleep(500 + Math.random() * 1000);
                await this.printLine('[*] 10.10.10.10:21 - 331 Please specify the password.');
                await this.sleep(500 + Math.random() * 1000);
                await this.printLine('[*] 10.10.10.10:21 - Sending crafted password...');
                await this.sleep(500 + Math.random() * 1000);
                await this.printLine('[*] 10.10.10.10:21 - Waiting for backdoor response...');
                await this.sleep(500 + Math.random() * 1000);
                await this.printLine('[+] 10.10.10.10:21 - Backdoor triggered successfully!');
                
                // Last bunch - instant
                await this.printLine('[*] 10.10.10.10:21 - Attempting to connect to backdoor shell on port 6200...');
                await this.printLine('[+] 10.10.10.10:21 - Connection established');
                await this.printLine('[*] 10.10.10.10:21 - Verifying shell access...');
                await this.printLine('[+] 10.10.10.10:21 - Shell confirmed: uid=0(root) gid=0(root)');
                await this.printLine('[+] 10.10.10.10:21 - ROOT ACCESS OBTAINED');
                await this.printLine('[*] Command shell session 1 opened (192.168.1.100:45678 -> 10.10.10.10:6200) at 2025-11-25 13:05:42 -0600');
                await this.sleep(300);
                await this.printLine('');
            }

            async runFailedExploit1() {
                await this.printLine('[*] Started reverse TCP handler on 192.168.1.100:4444');
                await this.sleep(800);
                await this.printLine('[*] 10.10.10.10:21 - Attempting to connect to FTP service...');
                await this.sleep(1000);
                await this.printLine('[*] 10.10.10.10:21 - Connected to target FTP server');
                await this.sleep(700);
                await this.printLine('[*] 10.10.10.10:21 - Banner: 220 (vsFTPd 2.3.4)');
                await this.sleep(900);
                await this.printLine('[*] 10.10.10.10:21 - Attempting authentication bypass...');
                await this.sleep(1500);
                await this.printLine('[-] 10.10.10.10:21 - Exploit failed: Authentication method not supported by this version');
                await this.printLine('[-] Exploit aborted due to failure');
            }

            async runFailedExploit2() {
                await this.printLine('[*] Started reverse TCP handler on 192.168.1.100:4444');
                await this.sleep(800);
                await this.printLine('[*] 10.10.10.10:21 - Attempting to connect to FTP service...');
                await this.sleep(1000);
                await this.printLine('[*] 10.10.10.10:21 - Connected to target FTP server');
                await this.sleep(700);
                await this.printLine('[*] 10.10.10.10:21 - Banner: 220 (vsFTPd 2.3.4)');
                await this.sleep(900);
                await this.printLine('[*] 10.10.10.10:21 - Checking for download feature...');
                await this.sleep(1400);
                await this.printLine('[-] 10.10.10.10:21 - Exploit failed: Download feature not enabled on target');
                await this.printLine('[-] Exploit aborted due to failure');
            }

            async handleShellCommand(cmd, lower) {
                if (lower === 'id') {
                    await this.printLine('uid=0(root) gid=0(root) groups=0(root)');
                } else if (lower === 'whoami') {
                    await this.printLine('root');
                } else if (lower === 'getuid') {
                    await this.printLine('Server username: uid=0(root) gid=0(root) euid=0(root) egid=0(root)');
                } else if (lower === 'sysinfo') {
                    await this.sleep(300);
                    await this.printLine('Computer        : metasploitable');
                    await this.printLine('OS              : Linux 2.6.24-16-server');
                    await this.printLine('Architecture    : i686');
                    await this.printLine('System Language : en_US');
                    await this.printLine('Domain          : WORKGROUP');
                    await this.printLine('Logged On Users : 1');
                    await this.printLine('Meterpreter     : x86/linux');
                } else if (lower.startsWith('uname')) {
                    await this.printLine('Linux metasploitable 2.6.24-16-server #1 SMP Thu Apr 10 13:58:00 UTC 2008 i686 GNU/Linux');
                } else if (lower === 'pwd') {
                    await this.printLine(this.currentDir);
                } else if (lower.startsWith('cd ')) {
                    const target = cmd.substring(3).trim();
                    if (target === '..') {
                        if (this.currentDir !== '/root') {
                            this.currentDir = '/root';
                        }
                    } else if (['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos'].includes(target)) {
                        this.currentDir = `/root/${target}`;
                    } else if (target === '/root' || target === '~') {
                        this.currentDir = '/root';
                    } else {
                        await this.printLine(`sh: cd: ${target}: No such file or directory`);
                    }
                } else if (lower.startsWith('ls')) {
                    await this.sleep(200);
                    if (this.currentDir === '/root') {
                        await this.printLine('Desktop  Documents  Downloads  Music  Pictures  Videos');
                    } else if (this.currentDir === '/root/Downloads') {
                        await this.printLine('root.txt');
                    } else {
                        // Empty directory
                    }
                } else if (lower.startsWith('cat root.txt') || lower.startsWith('cat /root/Downloads/root.txt')) {
                    await this.sleep(200);
                    await this.printLine('');
                    await this.printLine('╔═══════════════════════════════════════════════════════╗');
                    await this.printLine('║                                                       ║');
                    await this.printLine('║               🏁 CONGRATULATIONS! 🏁                  ║');
                    await this.printLine('║                                                       ║');
                    await this.printLine('║     You have successfully compromised the target!     ║');
                    await this.printLine('║                                                       ║');
                    await this.printLine('║     FLAG: METASIM{y0u_4r3_4_h4ck3r_n0w}              ║');
                    await this.printLine('║                                                       ║');
                    await this.printLine('║           MetaSim Training Complete ✓                 ║');
                    await this.printLine('║                                                       ║');
                    await this.printLine('╚═══════════════════════════════════════════════════════╝');
                    await this.printLine('');
                } else if (lower === 'hostname') {
                    await this.printLine('metasploitable');
                } else if (lower.startsWith('cat /etc/passwd')) {
                    await this.sleep(300);
                    await this.printLine('root:x:0:0:root:/root:/bin/bash');
                    await this.printLine('daemon:x:1:1:daemon:/usr/sbin:/bin/sh');
                    await this.printLine('bin:x:2:2:bin:/bin:/bin/sh');
                    await this.printLine('sys:x:3:3:sys:/dev:/bin/sh');
                    await this.printLine('sync:x:4:65534:sync:/bin:/bin/sync');
                } else if (lower.startsWith('cat /etc/shadow')) {
                    await this.sleep(200);
                    await this.printLine('root:$6$abc123$xyz789:17000:0:99999:7:::');
                    await this.printLine('daemon:*:17000:0:99999:7:::');
                    await this.printLine('bin:*:17000:0:99999:7:::');
                } else if (lower.startsWith('curl')) {
                    await this.sleep(600);
                    await this.printLine('curl: (6) Could not resolve host: connection timed out');
                } else if (lower.startsWith('wget')) {
                    await this.sleep(500);
                    await this.printLine('--2025-11-25 13:10:42--  (trying to connect)');
                    await this.sleep(800);
                    await this.printLine('Failed to connect: Network is unreachable');
                } else if (lower.startsWith('find')) {
                    await this.sleep(400);
                    if (lower.includes('root.txt')) {
                        await this.printLine('/root/Downloads/root.txt');
                    } else {
                        await this.printLine('/root');
                        await this.printLine('/root/Desktop');
                        await this.printLine('/root/Documents');
                        await this.printLine('/root/Downloads');
                    }
                } else if (lower.startsWith('grep')) {
                    await this.sleep(300);
                    await this.printLine('grep: missing operand');
                } else if (lower === 'env' || lower === 'printenv') {
                    await this.printLine('PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin');
                    await this.printLine('HOME=/root');
                    await this.printLine('SHELL=/bin/sh');
                    await this.printLine('USER=root');
                } else if (lower === 'date') {
                    await this.printLine('Mon Nov 25 13:10:45 CST 2025');
                } else if (lower === 'uptime') {
                    await this.printLine(' 13:10:45 up 1:10,  1 user,  load average: 0.00, 0.01, 0.05');
                } else if (lower.startsWith('echo')) {
                    const text = cmd.substring(5).trim();
                    await this.printLine(text);
                } else if (lower === 'ps aux' || lower === 'ps') {
                    await this.sleep(400);
                    await this.printLine('USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND');
                    await this.printLine('root         1  0.0  0.1   2872  1436 ?        Ss   12:00   0:01 init');
                    await this.printLine('root       523  0.0  0.1   5316  1576 ?        Ss   12:00   0:00 /usr/sbin/sshd');
                    await this.printLine('root      1337  0.0  0.0   1234   567 ?        S    13:05   0:00 vsftpd');
                } else if (lower.startsWith('ifconfig') || lower === 'ip a') {
                    await this.sleep(300);
                    await this.printLine('eth0      Link encap:Ethernet  HWaddr 00:0c:29:3e:2f:4a');
                    await this.printLine('          inet addr:10.10.10.10  Bcast:10.10.10.255  Mask:255.255.255.0');
                    await this.printLine('          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1');
                } else if (lower === 'netstat -tulpn' || lower === 'netstat') {
                    await this.sleep(400);
                    await this.printLine('Active Internet connections (only servers)');
                    await this.printLine('Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program');
                    await this.printLine('tcp        0      0 0.0.0.0:21              0.0.0.0:*               LISTEN      1337/vsftpd');
                    await this.printLine('tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      523/sshd');
                } else {
                    await this.printLine(`sh: ${cmd}: not found`);
                }
            }

            navigateHistory(direction) {
                if (this.commandHistory.length === 0) return;

                this.historyIndex += direction;
                
                if (this.historyIndex < 0) {
                    this.historyIndex = 0;
                } else if (this.historyIndex >= this.commandHistory.length) {
                    this.historyIndex = this.commandHistory.length;
                    this.input.value = '';
                    return;
                }

                this.input.value = this.commandHistory[this.historyIndex] || '';
            }
        }

        const terminal = new Terminal();

        // Auto-focus on tap
        document.addEventListener('click', () => {
            terminal.input.focus();
        });

        // Prevent zoom
        document.addEventListener('touchmove', (e) => {
            if (e.scale !== 1) e.preventDefault();
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    </script>
</body>
</html>
