'use strict';

export function NotificationService(NotificationAPI, $q, Util) {
     'ngInject';
     const data = {
          notifications: []
     };
     return {
          getNotifications,
          deleteNotifications: () => data.notifications.splice(0),
          getData: type => data[type]
     };

     function getNotifications({userId} = {}) {
          if (!userId) {
               data.notifications.splice(0);
               return $q.when(data.notifications)
          }
          if (_.size(data.notifications)) {
               return $q.when(data.notifications)
          }
          return NotificationAPI.query({userId}).$promise
               .then(no => {
                    Util.bindArray(data.notifications, no);
                    return no;
               })
               .catch(err => console.log(err));
     }
}
