const fs = await import('node:fs/promises');

const chromeHost = 'http://127.0.0.1:9223';
const appUrl = process.env.APP_URL || 'http://localhost:3002';
const outputDir = new URL('../docs/screenshots/', import.meta.url);

await fs.mkdir(outputDir, { recursive: true });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createPage = async (url) => {
  const response = await fetch(`${chromeHost}/json/new?${encodeURIComponent(url)}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`Could not create Chrome page: ${response.status} ${response.statusText}`);
  }

  const page = await response.json();
  return connect(page.webSocketDebuggerUrl);
};

const connect = (webSocketUrl) => {
  const ws = new WebSocket(webSocketUrl);
  let id = 0;
  const pending = new Map();

  ws.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
    }
  });

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  const send = async (method, params = {}) => {
    await ready;
    const messageId = ++id;

    ws.send(JSON.stringify({ id: messageId, method, params }));

    return new Promise((resolve, reject) => {
      pending.set(messageId, { resolve, reject });
    });
  };

  return {
    send,
    close: () => ws.close(),
  };
};

const setupViewport = async (page, width = 1440, height = 900) => {
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
};

const evaluate = async (page, expression) => page.send('Runtime.evaluate', {
  expression,
  awaitPromise: true,
  returnByValue: true,
});

const waitForSelector = async (page, selector) => {
  await evaluate(page, `
    new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        if (document.querySelector(${JSON.stringify(selector)})) {
          resolve(true);
          return;
        }

        if (Date.now() - started > 10000) {
          reject(new Error('Timed out waiting for ${selector}'));
          return;
        }

        setTimeout(tick, 100);
      };

      tick();
    })
  `);
};

const click = async (page, selector) => evaluate(page, `
  document.querySelector(${JSON.stringify(selector)}).click();
`);

const fill = async (page, selector, value) => evaluate(page, `
  (() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })();
`);

const screenshot = async (page, filename) => {
  const { data } = await page.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  await fs.writeFile(new URL(filename, outputDir), Buffer.from(data, 'base64'));
};

const joinRoom = async (page, name, room) => {
  await waitForSelector(page, '.joinInput');
  await fill(page, '.joinInput:nth-of-type(1)', name);
  await fill(page, '.joinInput.mt-20', room);
  await click(page, '.button');
  await waitForSelector(page, '.messages');
};

const sendMessage = async (page, message) => {
  await waitForSelector(page, '.input');
  await fill(page, '.input', message);
  await click(page, '.sendButton');
};

const join = await createPage(appUrl);
await setupViewport(join);
await join.send('Page.enable');
await join.send('Runtime.enable');
await waitForSelector(join, '.joinOuterContainer');
await screenshot(join, 'join.png');

const alice = await createPage(`${appUrl}/chat?name=Alice&room=demo`);
await setupViewport(alice);
await alice.send('Page.enable');
await alice.send('Runtime.enable');
await waitForSelector(alice, '.messages');
await delay(1000);
await screenshot(alice, 'chat-room.png');

const bob = await createPage(`${appUrl}/chat?name=Bob&room=demo`);
await setupViewport(bob);
await bob.send('Page.enable');
await bob.send('Runtime.enable');
await waitForSelector(bob, '.messages');
await delay(1000);
await sendMessage(alice, 'Hello Bob, this message was encrypted in the browser.');
await delay(1500);
await screenshot(alice, 'message-flow.png');

join.close();
alice.close();
bob.close();
