const path = require('path');
const fs = require('fs').promises;
const frontmatter = require('@github-docs/frontmatter');
const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022');
const core = require('@actions/core');
// const github = require('@actions/github');

const schema = {
  properties: {
    title:     { type: 'string',  required: true },
    emoji:     { type: 'string',  required: true },
    type:      { type: 'string',  required: true, enum: ['tech', 'idea'] },
    topics:    { type: 'array',   required: true },
    published: { type: 'boolean', required: true },
    publishAt: { type: 'any' }
  }
};

async function publishDir(dirpath, options) {
  const dir = await fs.opendir(dirpath);
  const now = moment();
  console.debug(options.timezone);
  for await (const dirent of dir) {
    const filepath = path.join(dirpath, dirent.name);
    if (!filepath.endsWith('.md')) {
      continue
    }

    const file = await fs.readFile(filepath, {'encoding': 'utf8'})
    const {data, content, errors} = frontmatter(file, {schema, filepath})
    if (errors.length > 0) {
      console.error(errors)
      continue
    }
    if (data.published) {
      console.debug(`found published article: ${dirent.name}`);
      continue
    }
    if (!('publishAt' in data)) {
      console.debug(`found unreserved article: ${dirent.name}`);
      continue
    }
    const publishAt = moment.tz(data.publishAt, options.timezone);
    if (now.isBefore(publishAt)) {
      console.debug(`found unpublished article: ${dirent.name}`);
      continue
    }
    console.info(`publish ${dirent.name} (at ${publishAt})`);
    data.published = true;
    delete data.publishAt;

    await fs.writeFile(filepath, frontmatter.stringify(content, data), 'utf8')
  }
}

try {
  // `timezone` input defined in action metadata file
  const timezone = core.getInput('timezone');

  console.log(`Publish on ${timezone}`);
  await publishDir('./articles', {timezone});
} catch (error) {
  core.setFailed(error.message);
}
