import '../imports/api/collection.js';
import { Company } from '../imports/api/collection.js';

Meteor.startup(() => {
  // code to run on server at startup
    SyncedCron.start();
});

// Scheduler
SyncedCron.add({
    name: 'Synced company details with server in ever 24 hours.',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 24 houres');
    },
    job: function() {
        var numbersCrunched = CrushSomeNumbers();
        return numbersCrunched;
    }
});
function CrushSomeNumbers(){
let companies = Company.find({}).fetch();
    companies.forEach(function(item){
        HTTP.call( 'GET', `https://api.fullcontact.com/v2/company/lookup.json?domain=${item.website}`,
            {headers:{'X-FullContact-APIKey':'c140202bc95fece6'}}, function( error, response ) {
                if (error) {
                    console.log(error);
                 } else {
                    if(response.data){
                        Company.update({_id:item._id},{$set:{
                            'name':response.data.organization.name,
                            'website':response.data.website,
                            'approxEmployees':response.data.organization.approxEmployees,
                            'founded':response.data.organization.founded
                        }});
                        console.log("Success....");
                    }
                }
            });
    });
}