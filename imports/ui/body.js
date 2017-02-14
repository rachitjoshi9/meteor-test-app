import { Template } from 'meteor/templating';

import { Company } from '../api/collection.js';


import './body.html';

FlashMessages.configure({
  autoHide: true,
  hideDelay: 7000,
  autoScroll: true
});



//Helpers

Template.body.helpers({
  tasks() {
    return Company.find({});
  },
});
//Shows companies listing on listing page.
Template.list.helpers({
  settings: function () {
    return {
      collection: Company,
      rowsPerPage: 10,
      showFilter: true,
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'approxEmployees', label: 'Employees' },
        { key: 'founded', label: 'Founded' }
      ]
    };
  }
});
Accounts.ui.config({
passwordSignupFields: 'USERNAME_ONLY'
});

//Events

//On submit of company name hits api for details and stores it to collection.
Template.home.events({
  'submit .new-name'(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.text.value;
    HTTP.call( 'GET', `https://api.fullcontact.com/v2/company/lookup.json?domain=${name}`,
        {headers:{'X-FullContact-APIKey':'c140202bc95fece6'}}, function( error, response ) {
          if (error) {
            console.log(error);
            FlashMessages.sendError(error.message);
          } else {
            if(response.data){
              let result=Company.insert({
                'name':response.data.organization.name,
                'website':response.data.website,
                'approxEmployees':response.data.organization.approxEmployees,
                'founded':response.data.organization.founded
              });
              FlashMessages.sendSuccess("Success....");
            }
          }
        });
    target.text.value = '';
  },
});

Template.menuBar.events({
  'click #home' (event){
    Router.go('/');
  },
  'click #list'(event){
    Router.go('/company/list');
  }
});


