'use strict';
// @flow

export default class MessagesController {
     messages;
     requestService;
     me;
     message;
     currentConversation;
     Modal;
     userService;
     notification;
     conversations;
     conversationService;
     messageService;
     /*@ngInject*/
     constructor(userService, requestService, me, $stateParams, Modal, conversationService, messageService) {
          this.requestService = requestService;
          this.userService = userService;
          this.conversationService = conversationService;
          this.messageService = messageService;
          this.Modal = Modal;
          this.me = me;
          this.getName = user => user.businessName || `${user.firstName} ${user.lastName}`;
          this.conversations = userService.getData('conversations', 'all');//conversations + requests
          console.log('This.conversations :', this.conversations);
          const _id = $stateParams.id || _.get(_.orderBy(this.conversations, 'updatedAt', 'desc'), '[0]._id'); //params or newest
          const index = _.findIndex(this.conversations, {_id});
          this.currentConversation = this.conversations[index > 0 ? index : 0];
          if (this.currentConversation) {
               this.getConversation(this.currentConversation);
          }
          _.each(this.conversations, e => {
               e.updatedAt = new Date(e.updatedAt); // required for orderBy date
          });
          this.notification = message => ({
               user: this.me,
               request: this.currentConversation._id,
               createdAt: new Date(),
               type: 'notification',
               message
          });
     }

     getConversation(con) {
          if (this.conversation && this.currentConversation._id === con._id) return;
          const service = con.seller ? 'requestService' : 'conversationService';
          const method = con.seller ? 'getRequestMessages' : 'getConversationMessages';
          this[service][method](con).then(conv => {
               this.currentConversation = this.conversations[_.findIndex(this.conversations, {_id: con._id})];
               this.conversation = conv;
          });
     }

     sendMessage({e} = {}) {
          if (e && e.ctrlKey) {
               return this.message += '\n';//eslint-disable-line no-return-assign
          }
          const service = this.currentConversation.seller ? 'requestService' : 'messageService';
          const body = _.extend({message: this.message}, service === 'requestService' ? {req: this.currentConversation} : {conversation: this.currentConversation._id});
          this[service].createMessage(body)
               .then(message => {
                    this.conversation.push(_.extend(message, {user: this.me}));
                    this.currentConversation.updatedAt = new Date();
                    this.currentConversation.message = this.message;
                    this.message = '';
               });
     }

     accept() {
          this.Modal.confirm('Approve', this.currentConversation.sale.book.title)
               .then(() => this.userService.approveRequest(this.currentConversation))
               .then(() => {
                    this.conversation.push(this.notification(`${this.getName(this.me)} accepted book request`));
                    this.currentConversation.updatedAt = new Date();
                    this.currentConversation.status = 'waiting';
                    this.currentConversation.message = `${this.getName(this.me)} accepted book request`;
               })
               .catch(err => console.log('err', err));
     }

     deliver() {
          this.Modal.confirm('Mark as delivered', this.currentConversation.sale.book.title)
               .then(() => this.userService.deliverRequest(this.currentConversation))
               .then(() => {
                    this.conversation.push(this.notification(`${this.getName(this.me)} marked book as delivered`));
                    this.currentConversation.updatedAt = new Date();
                    this.currentConversation.status = 'delivered';
                    this.currentConversation.message = `${this.getName(this.me)} marked book as delivered`;
               })
               .catch(err => console.log('err', err));
     }

}
