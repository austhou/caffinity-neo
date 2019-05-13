/**
 * Simple hard coded schema for users.
 * Hard code users so we don't have to provision them when we make a new database.
 * 
 * Using Mongoose for this would look like
 * https://mianlabs.com/2018/05/09/understanding-sessions-and-local-authentication-in-express-with-passport-and-mongodb/
 * But we won't bother with this since in production it'll be replaced with some passport module such as ActiveDirectory or OAuth.
 */
var records = [
    { id: 1, username: 'austin', password: 'caffinityadmin', displayName: 'Austin' },
    { id: 2, username: 'beebee', password: 'caffinityadmin', displayName: 'BB' },
    { id: 2, username: 'rebz', password: 'admin', displayName: '' },
    { id: 2, username: 'waj', password: 'admin', displayName: '' },
    { id: 2, username: 'aya', password: 'admin', displayName: '' },
];

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}
