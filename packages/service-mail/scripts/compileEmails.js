/* eslint-disable */
const fs = require('fs');
const glob = require('glob');
const Handlebars = require('handlebars');
const mjml2html = require('mjml');
const path = require('path');
const { defaultMailConfig, paths } = require('../constants/MailConfig');
const { DEFAULT_LOCALE } = require('../constants/Locale');

const readFilePromise = (filePath, options) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, options, (err, result) =>
      err ? reject(err) : resolve(result),
    );
  });

const readDirectoryPromise = (dirPath, options) =>
  new Promise((resolve, reject) => {
    fs.readdir(dirPath, options, (err, result) =>
      err ? reject(err) : resolve(result),
    );
  });

const compileMjmlPartial = async filePath => {
  const raw = await readFilePromise(filePath, { encoding: 'utf-8' });

  const name = filePath.substring(
    filePath.lastIndexOf('/') + 1,
    filePath.indexOf('.mjml'),
  );

  Handlebars.registerPartial(name, Handlebars.compile(raw));
};

const compileMjmlEmail = async filePath => {
  const raw = await readFilePromise(filePath, { encoding: 'utf-8' });

  const name = filePath.substring(
    filePath.lastIndexOf('/') + 1,
    filePath.indexOf('.mjml'),
  );

  return {
    template: Handlebars.compile(raw),
    name,
  };
};

const saveEmail = ({ template, name }) => {
  const mjml = template();
  const email = mjml2html(mjml);

  if (email.errors.length !== 0) {
    console.error(email.errors);
  }

  fs.writeFileSync(
    path.resolve(__dirname, `../compiled/${name}Email.ts`),
    `export const htmlTemplate = \`${email.html}\``,
    {
      encoding: 'utf-8',
    },
  );
};

const saveEmailPreview = async ({ template, name }) => {
  const mjml = template();
  const email = mjml2html(mjml);

  if (email.errors.length !== 0) {
    console.error(email.errors);
  }

  const { htmlTemplate } = require(`../compiled/${name}Email`);
  const { previewData, locale } = require(`../templates/${name}/${name}Data`);
  const { compileBody } = require(`../utils/compileBody`);

  const html = await compileBody(
    htmlTemplate,
    Object.assign(
      previewData,
      locale(previewData)[DEFAULT_LOCALE],
      paths,
      defaultMailConfig,
    ),
  );

  fs.writeFileSync(
    path.resolve(__dirname, `../preview/${name}Preview.html`),
    html,
    {
      encoding: 'utf-8',
    },
  );
};

const compileEmails = () => {
  return new Promise((resolve, reject) => {
    Handlebars.registerHelper('raw', function(options) {
      return options.fn(this);
    });

    glob(path.resolve(__dirname, '../**/*.mjml'), async (err, files) => {
      if (err) reject(err);
      const partialFiles = files.filter(file => file.includes('partials'));
      const emailFiles = files.filter(file => !file.includes('partials'));

      await Promise.all(partialFiles.map(compileMjmlPartial));
      const emailTemplates = await Promise.all(
        emailFiles.map(compileMjmlEmail),
      );

      emailTemplates.forEach(saveEmail);
      await Promise.all(emailTemplates.map(saveEmailPreview));
      resolve();
    });
  });
};

compileEmails()
  .then(res => {
    process.exit(0);
  })
  .catch(err => {
    process.exit(1);
  });
