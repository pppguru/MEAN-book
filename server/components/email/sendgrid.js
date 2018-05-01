import sg, { mail as helper } from 'sendgrid';
import { getTemplateDetails } from './helper';

const sendgrid = sg(config.SENDGRID_API_KEY);

async function sendTemplate(name, tos, variables, subject, att) {
     let total = 0;
     try {
          if (_.includes(['development'], config.env)) return undefined;
          if (!_.isArray(tos)) tos = [tos];
          if (!_.isArray(variables)) variables = [variables];
          if (tos.length !== variables.length && variables.length === 1) {
               variables = _.fill(Array(tos.length), variables[0]);
          }
          const templateDetails = getTemplateDetails(name);
          if (!templateDetails) return undefined;
          if (!templateDetails.template) throw `Unknown template ${name}`;
          if (!templateDetails.from) throw 'You must set "from email" for this template';

          await Promise.all(_.map(tos, async (to, ind) => { //eslint-disable-line arrow-parens
               const mail = new helper.Mail();
               const category = new helper.Category(name);
               const fromEmail = new helper.Email(templateDetails.from, templateDetails.fromName);
               const personalization = new helper.Personalization();
               const { html, subject: subj } = await templateDetails.template.render(variables[ind]);
               const content = new helper.Content('text/html', html);

               const toEmail = new helper.Email(to);
               personalization.addTo(toEmail);

               mail.addPersonalization(personalization);
               mail.setFrom(fromEmail);
               mail.addContent(content);
               mail.addCategory(category);
               if (config.env === 'production') {
                    mail.setSubject(subject || subj);
               } else {
                    mail.setSubject(`${_.toUpper(config.env)} - ${subject || subj}`);
               }
               if (att) {
                    const attachment = new helper.Attachment();
                    attachment.setContent(att.base64);
                    attachment.setType(att.contentType);
                    attachment.setFilename(att.fileName);
                    attachment.setDisposition(att.disposition || 'attachment');
                    mail.addAttachment(attachment);
               }
               const request = sendgrid.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
               });

               await sendgrid.API(request); // eslint-disable-line new-cap
               total += 1;
          }));
     } catch (err) {
          console.error(err);
     }
     return Promise.resolve(total);
}

export default {
     sendTemplate,
};
