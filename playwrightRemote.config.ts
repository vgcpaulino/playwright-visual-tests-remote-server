
import config from './playwright.config';

const updateConfig = config;

updateConfig.projects?.map(project => {
  const name: string = project.name || '';

  let port;
  switch (name) {
    case 'chromium':
      port = 1010;
      break;
    case 'firefox':
      port = 1011;
      break;
    case 'webkit':
      port = 1012
      break;
    default:
      throw new Error('Browser Not Found!');
  }

  project.use = {
    ...project.use,
    connectOptions: {
      wsEndpoint: `ws://localhost:${port}/${name}`,
      exposeNetwork: "*",
      timeout: 30000,
    }
  }
});

config.use = {
  ...config.use,
  baseURL: 'http://host.docker.internal:3000/',
}

module.exports = updateConfig;