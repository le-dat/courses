const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Course = new Schema({
    name: { type: String, maxLength: 255 , require},
    description: { type: String, require},
    image: {type: String},
    videoId: {type: String, maxLength: 255, require},
    level: {type: String},
    slug: { type: String, slug: "name", unique: true},
}, {
    timestamps: true
});

// Add plugins
mongoose.plugin(slug);
Course.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' 
});

module.exports = mongoose.model('courses', Course);
// module.exports = mongoose.model('course', Course);
// course khi exports máy tự hiểu thêm s => courses