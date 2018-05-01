import Conversation from '../../../api/conversation/conversation.model';

export default async function (doc) {
     console.log('*** MESSAGE SENT ***');
     const conversation = await Conversation.findById(doc.conversation);
     conversation.message = doc.message;
     conversation.save();
};
