const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const cwd = path.resolve(__dirname);
const glob = require('glob');

function flatten(list) {
  return list.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flatten(item));
    } else {
      return acc.concat(item);
    }
  }, []);
}

function getWorkspaces(from) {
  const root = path.resolve(cwd, '../..');
  const { workspaces } = require(path.join(root, 'package.json'));
  return flatten(
    workspaces.packages.map(name => glob.sync(path.join(root, name))),
  );
}

const excludedPackages = ['packages/app-salon-mobile', 'tsconfig.json'];
const workspaces = getWorkspaces(__dirname).filter(
  dir => !excludedPackages.some(excluded => dir.includes(excluded)),
);

const noHoistDependencies = (() => {
  const { workspaces } = require('./package.json');
  const nohoist = workspaces && workspaces.nohoist ? workspaces.nohoist : [];
  return ['react-native', 'react', ...nohoist];
})();

const blacklistDeps = ['concurrently', 'crypto'].map(
  dep =>
    new RegExp(
      `${path.resolve(cwd, '../..')}/node_modules/${dep}/.*`.replace(
        /\//g,
        path.sep,
      ),
    ),
);

function getBlacklist() {
  const rootPath = path.resolve(cwd, '../..');
  const directories = [rootPath].concat(workspaces);
  const blacklistPaths = noHoistDependencies
    .map(dependency =>
      directories.map(dir => `${dir}/node_modules/${dependency}/.*`),
    )
    .reduce((acc, value) => {
      return [...acc, ...value];
    })
    .map(dir => new RegExp(dir.replace(/\//g, path.sep)));

  return blacklist(blacklistPaths.concat(blacklistDeps));
}

function getExtraNodeModules() {
  return noHoistDependencies.reduce((obj, dep) => {
    obj[dep] = path.resolve(cwd, `./node_modules/${dep}`);
    return obj;
  }, {});
}

const watchFolders = [path.resolve(cwd, '../..', 'node_modules')].concat(
  workspaces,
);

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    blacklistRE: getBlacklist(),
    extraNodeModules: {
      crypto: require.resolve('./polyfills/common'),
      stream: require.resolve('./polyfills/common'),
      vm: require.resolve('./polyfills/common'),
      os: require.resolve('./polyfills/common'),
      path: require.resolve('./polyfills/common'),
      fs: require.resolve('./polyfills/common'),
      zlib: require.resolve('./polyfills/common'),
      https: require.resolve('./polyfills/common'),
      http: require.resolve('./polyfills/common'),
      child_process: require.resolve('./polyfills/common'),
      tls: require.resolve('./polyfills/common'),
      net: require.resolve('./polyfills/common'),
      color: require.resolve('./polyfills/common'),
      concurrently: require.resolve('./polyfills/common'),

      ...getExtraNodeModules(),
    },
  },
  watchFolders,
};
