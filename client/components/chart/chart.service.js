'use strict';

export function chartService() {
     'ngInject';

     return {
          orderHistoryChart
     };

     function orderHistoryChart() {
          return {
               override: {
                    backgroundColor: '#3e6068',
                    hoverBackgroundColor: '#ff5722',
				pointBackgroundColor: 'red',
                    label: 'Books'
               },
               labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
               options: {
                    scales: {
                         yAxes: [{
                              ticks: {
                                   beginAtZero: true,
                                   userCallback: label => {
                                        if (Math.floor(label) === label) {
                                             return label;
                                        }
                                   }
                              },
                              gridLines: {
                                   display: true,
                                   borderDash: [4]
                              }
                         }],
                         xAxes: [{
                              gridLines: {
                                   display: false
                              }
                         }]
                    }
               }
          };
     }
}
