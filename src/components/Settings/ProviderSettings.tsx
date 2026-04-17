import { c as _c } from 'react-compiler-runtime'
import * as React from 'react'
import { Box, Text } from '../../ink.js'
import { hasLocalOllama } from '../../utils/providerDiscovery.js'

export function ProviderSettings(): React.ReactNode {
  const $ = _c(20);
  const [currentProvider, setCurrentProvider] = React.useState(() =>
    process.env.BEAST_PROVIDER || 'auto'
  );
  const [nvidiaKey, setNvidiaKey] = React.useState(() =>
    process.env.NVIDIA_API_KEY ? '***' + process.env.NVIDIA_API_KEY.slice(-4) : ''
  );
  const [openRouterKey, setOpenRouterKey] = React.useState(() =>
    process.env.OPENROUTER_API_KEY ? '***' + process.env.OPENROUTER_API_KEY.slice(-4) : ''
  );
  const [openaiKey, setOpenaiKey] = React.useState(() =>
    process.env.OPENAI_API_KEY ? '***' + process.env.OPENAI_API_KEY.slice(-4) : ''
  );
  const [ollamaStatus, setOllamaStatus] = React.useState<'checking' | 'running' | 'not-found'>('checking');
  const [saved, setSaved] = React.useState<string | null>(null);

  React.useEffect(() => {
    hasLocalOllama().then(running => {
      setOllamaStatus(running ? 'running' : 'not-found');
    });
  }, []);

  let t0;
  if ($[0] !== currentProvider || $[1] !== nvidiaKey) {
    t0 = <Box flexDirection="column" paddingY={1}>
      <Text bold={true} color="beastcli">🐺 BeastCLI Provider Settings</Text>
      <Text dimColor={true}>{'━'.repeat(56)}</Text>
    </Box>;
    $[0] = currentProvider;
    $[1] = nvidiaKey;
    $[2] = t0;
  } else {
    t0 = $[2];
  }

  let t1;
  if ($[3] !== ollamaStatus || $[4] !== nvidiaKey || $[5] !== openRouterKey) {
    t1 = <Box flexDirection="column" marginY={1}>
      <Text>⚡ NVIDIA NIM</Text>
      <Text dimColor={true}>Fast GPU inference - 40 RPM</Text>
      <Text dimColor={true}>Key: {nvidiaKey || 'Not configured'}</Text>
    </Box>;
    $[3] = ollamaStatus;
    $[4] = nvidiaKey;
    $[5] = openRouterKey;
    $[6] = t1;
  } else {
    t1 = $[6];
  }

  let t2;
  if ($[7] !== ollamaStatus || $[8] !== openRouterKey) {
    t2 = <Box flexDirection="column" marginY={1}>
      <Text>🎯 OpenRouter</Text>
      <Text dimColor={true}>200+ models available</Text>
      <Text dimColor={true}>Key: {openRouterKey || 'Not configured'}</Text>
    </Box>;
    $[7] = ollamaStatus;
    $[8] = openRouterKey;
    $[9] = t2;
  } else {
    t2 = $[9];
  }

  let t3;
  if ($[10] !== ollamaStatus) {
    t3 = <Box flexDirection="column" marginY={1}>
      <Text>🦙 Ollama</Text>
      <Text dimColor={true}>
        {ollamaStatus === 'checking' ? 'Checking...' :
         ollamaStatus === 'running' ? '✓ Running locally' : '✗ Not installed'}
      </Text>
      <Text dimColor={true}>Free, offline, privacy-first</Text>
    </Box>;
    $[10] = ollamaStatus;
    $[11] = t3;
  } else {
    t3 = $[11];
  }

  let t4;
  if ($[12] !== openaiKey) {
    t4 = <Box flexDirection="column" marginY={1}>
      <Text>🤖 OpenAI</Text>
      <Text dimColor={true}>GPT-4 and other models</Text>
      <Text dimColor={true}>Key: {openaiKey || 'Not configured'}</Text>
    </Box>;
    $[12] = openaiKey;
    $[13] = t4;
  } else {
    t4 = $[13];
  }

  let t5;
  if ($[14] !== currentProvider) {
    t5 = <Box flexDirection="column" marginY={1}>
      <Text bold={true} marginTop={1}>Current Provider: {currentProvider.toUpperCase()}</Text>
    </Box>;
    $[14] = currentProvider;
    $[15] = t5;
  } else {
    t5 = $[15];
  }

  let t6;
  if ($[16] !== saved) {
    t6 = saved ? <Text color="green">{saved}</Text> : null;
    $[16] = saved;
    $[17] = t6;
  } else {
    t6 = $[17];
  }

  let t7;
  if ($[18] !== t0 || $[19] !== t1 || $[20] !== t2 || $[21] !== t3 || $[22] !== t4 || $[23] !== t5 || $[24] !== t6) {
    t7 = <Box flexDirection="column">
      {t0}
      <Box marginY={1} borderStyle="round" borderColor="inactive" paddingX={2} paddingY={1}>
        {t1}
        {t2}
        {t3}
        {t4}
      </Box>
      {t5}
      {t6}
      <Box marginY={1}>
        <Text dimColor={true}>Quick Setup:</Text>
        <Text dimColor={true}>  /provider setup nvidia     - Configure NVIDIA</Text>
        <Text dimColor={true}>  /provider setup openrouter - Configure OpenRouter</Text>
        <Text dimColor={true}>  /provider setup ollama     - Configure Ollama</Text>
        <Text dimColor={true}>  /provider setup openai     - Configure OpenAI</Text>
        <Text dimColor={true}>  /provider setup status     - View all providers</Text>
      </Box>
      <Text dimColor={true} marginTop={1}>{'─'.repeat(56)}</Text>
    </Box>;
    $[18] = t0; $[19] = t1; $[20] = t2; $[21] = t3; $[22] = t4; $[23] = t5; $[24] = t6; $[25] = t7;
  } else {
    t7 = $[25];
  }

  return t7;
}
