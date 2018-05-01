'use strict';

import angular from 'angular';
import PeopleController from './people.controller';
import following from './following';
import followers from './followers';
import routing from './people.routes';
import followPanel from '../../../../components/follow-panel.component/follow-panel.component';

export default angular.module('bookisApp.people', [following, followers, followPanel])
     .config(routing)
     .controller('PeopleController', PeopleController)
     .name;
