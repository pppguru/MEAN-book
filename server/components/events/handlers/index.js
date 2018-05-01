import saleRequested from './sale-requested';
import saleApproved from './sale-approved';
import saleDelivered from './sale-delivered';
import saleDeclined from './sale-declined';
import saleCanceled from './sale-canceled';
import requestExpired from './request-expired';
import reviewCreated from './review-created';
import replyCreated from './reply-created';
import replyDeleted from './reply-deleted';
import reviewDeleted from './review-deleted';
import saleCreated from './sale-created';
import saleDeleted from './sale-deleted';
import userDeactivated from './user-deactivated';
import userReactivated from './user-reactivated';
import messageSent from './message-sent';
import conversationStarted from './conversation-started';
import userFollowed from './user-followed';

const {events} = config;

export default {
     [events.SALE_REQUESTED]: saleRequested,
     [events.SALE_APPROVED]: saleApproved,
     [events.SALE_DELIVERED]: saleDelivered,
     [events.SALE_DECLINED]: saleDeclined,
     [events.SALE_CANCELED]: saleCanceled,
     [events.REQUEST_EXPIRED]: requestExpired,
     [events.REVIEW_CREATED]: reviewCreated,
     [events.REPLY_CREATED]: replyCreated,
     [events.REPLY_DELETED]: replyDeleted,
     [events.REVIEW_DELETED]: reviewDeleted,
     [events.SALE_CREATED]: saleCreated,
     [events.SALE_DELETED]: saleDeleted,
     [events.USER_DEACTIVATED]: userDeactivated,
     [events.USER_FOLLOWED]: userFollowed,
     [events.MESSAGE_SENT]: messageSent,
     [events.CONVERSATION_STARTED]: conversationStarted,
     [events.USER_REACTIVATED]: userReactivated
};
