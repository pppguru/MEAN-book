import sendgrid from './sendgrid';
import sendgridMock from './sendgrid.mock';

export default (() => {//eslint-disable-line arrow-body-style
     return config.env === 'test' ? sendgridMock : sendgrid;
})();
