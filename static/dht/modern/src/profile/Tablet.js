Ext.define('dhcp.profile.Tablet', {
    extend: 'Ext.app.Profile',

    requires: [
        'dht.view.tablet.*'
    ],

    // Map tablet/desktop profile views to generic xtype aliases:
    //
    views: {
        email: 'dhcp.view.tablet.email.Email',
        inbox: 'dhcp.view.tablet.email.Inbox',
        compose: 'dhcp.view.tablet.email.Compose',

        searchusers: 'dhcp.view.tablet.search.Users'
    },

    isActive: function () {
        return !Ext.platformTags.phone;
    }
});
