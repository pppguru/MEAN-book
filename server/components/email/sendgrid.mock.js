import sinon from 'sinon';
import { getTemplateDetails } from './helper';

async function sendTemplate(name, tos, variables) {
     if (!_.isArray(tos)) tos = [tos];
     if (!_.isArray(variables)) variables = [variables];
     if (tos.length !== variables.length && variables.length === 1) {
          variables = _.fill(Array(tos.length), variables[0]);
     }

     const templateDetails = getTemplateDetails(name);
     if (!templateDetails) return undefined;
     if (!templateDetails.template) throw `Unknown template ${name}`;
     if (!templateDetails.from) throw 'You must set "from email" for this template';

     await Promise.all(_.map(tos, async (to, ind) => {//eslint-disable-line arrow-parens
          emailStub.addSmtpapiTo(to);
          // Test that template can be rendered successful
          await templateDetails.template.render(variables[ind]);
     }));
     return tos.length;
}


export function resetStubs() {
     emailStub.addSmtpapiTo.reset();
     templateSpy.reset();
}

const mock = {
     sendTemplate,
};

const templateSpy = sinon.spy(mock, 'sendTemplate');

export const emailStub = {
     addSmtpapiTo: sinon.stub(),
     sendTemplate: templateSpy,
};

export default mock;
