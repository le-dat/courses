const Course = require('../models/Course')
const { multipleMongooseToObject } = require('../../util/mongoose')

class MeController {
    // GET /me/stored/courses
    storedCourses(req, res, next) {
        
        let courseQuery = Course.find({})

        if(req.query.hasOwnProperty('_sort')){
            courseQuery = courseQuery.sort({
                // name: 'desc'
                // name: '-1'
                [req.query.column]: req.query.type
            })
        }
        Promise.all([courseQuery , Course.countDocumentsDeleted(), Course.countDocuments()])
            .then(([courses, deletedCount, countDocuments]) => {
                res.render('me/stored-courses', { 
                    deletedCount,
                    countDocuments,
                    courses : multipleMongooseToObject(courses) 
                })
            })
            .catch(next)
    }
    // GET /me/trash/courses
    trashedCourses(req, res, next) {
        Promise.all([Course.findDeleted({}) , Course.countDocumentsDeleted(), Course.countDocuments()])
            .then(([courses, deletedCount, countDocuments]) => {
                res.render('me/trash-courses', { 
                    deletedCount,
                    countDocuments,
                    courses : multipleMongooseToObject(courses) 
                })
            })
            .catch(next)


        // Course.findDeleted({})
        //     .then(courses => {
        //         res.render('me/trash-courses', { 
        //             courses : multipleMongooseToObject(courses) 
        //         })
        //     })
        //     .catch(next)
    }
}
module.exports = new MeController