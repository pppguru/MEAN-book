import fs from 'fs';
import path from 'path';
import { EmailTemplate } from 'email-templates';

const templateDir = path.resolve(__dirname, '../../template/');

const getDirectories = srcPath => _.filter(fs.readdirSync(srcPath), file => fs.statSync(path.join(srcPath, file)).isDirectory());//eslint-disable-line no-sync
// Create template instance for every folder under 'server/templates'
const templates = _.reduce(getDirectories(templateDir), (acc, dir) => {
     acc[dir] = new EmailTemplate(`${templateDir}/${dir}/`, {
          preserveImportant: true
     });
     return acc;
}, {});

const noreply = {
     from: 'no-reply@bookis.no',
     fromName: 'Bookis'
};

const getTemplateDetails = templateName => _.assign({template: templates[templateName]}, (() => {
     switch (templateName) {
          case 'email-confirmation'://eslint-disable-line indent
          case 'reset-password'://eslint-disable-line indent
          case 'book-request'://eslint-disable-line indent
          case 'book-approve'://eslint-disable-line indent
          case 'book-deliver'://eslint-disable-line indent
          case 'book-decline'://eslint-disable-line indent
          case 'book-cancel'://eslint-disable-line indent
          case 'user-followed'://eslint-disable-line indent
          case 'conversation-started'://eslint-disable-line indent
          case 'reply-created'://eslint-disable-line indent
          case 'waitinglist-notified'://eslint-disable-line indent
               return noreply;//eslint-disable-line indent
          default://eslint-disable-line indent
               throw new Error(`Invalid template name ${templateName}`);//eslint-disable-line indent
     }
})());

export { getTemplateDetails };
