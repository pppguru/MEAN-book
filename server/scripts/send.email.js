// Example run: node ./pre.script.js --script=./send.email.js --env=development imornar@gmail.com book-approve
import emailService from '../components/email';

module.exports = (args) => {
     (async function () {
          let [email, template] = args;
          console.log('Email :', email);
          console.log('template :', template);
          const emailData = {
               reviewUrl: 'fake',
               user: 'John',
               title: 'Some Book'
          };
          console.log('EmailData :', emailData);
          emailService.sendTemplate(template, email, emailData);
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};