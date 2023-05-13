/* --------------------------- import JSONrecords --------------------------- */
const JsonRecords = require('json-records');




const UsersDb = new JsonRecords('./databases/jsons/users.json');
const BlogsDb = new JsonRecords('./databases/jsons/blogs.json');
const ChatsDb = new JsonRecords('./databases/jsons/chats.json');
const FriendsDb = new JsonRecords('./databases/jsons/friends.json');


module.exports={UsersDb ,BlogsDb , ChatsDb ,FriendsDb}