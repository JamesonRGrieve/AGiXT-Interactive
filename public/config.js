import { isBrowser } from '../lib/utils';

const config = {
  public: {},
  serverOnly: {}
};

const publicPrefix = 'NEXT_PUBLIC_';
const serverOnlyPrefix = 'SERVER_ONLY_';

function convertBoolean(value) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return value;
}

const sortKeys = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];

      return acc;
    }, {});
};

if (isBrowser()) {
  Object.entries(window.__env).forEach(([key, value]) => {
    config.public[key] = convertBoolean(value);
  });
  // we need to make sure keys are always in the same order to prevent "Text content did not match" issue
  // when displaying config on a page
  config.public = sortKeys(config.public);
} else {
  Object.entries(process.env).forEach(([key, value]) => {
    if (key.startsWith(publicPrefix)) {
      config.public[key.replace(publicPrefix, '')] = convertBoolean(value);
    }
    if (key.startsWith(serverOnlyPrefix)) {
      config.serverOnly[key.replace(serverOnlyPrefix, '')] = convertBoolean(value);
    }
  });
  // we need to make sure keys are always in the same order to prevent "Text content did not match" issue
  // when displaying config on a page
  config.public = sortKeys(config.public);
}

export default config;
