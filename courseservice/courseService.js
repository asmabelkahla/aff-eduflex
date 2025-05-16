const db = require('./db');

const CourseService = {
  ListCourses: (call, callback) => {
    db.all("SELECT * FROM courses", [], (err, rows) => {
      if (err) return callback(err, null);

      const courses = rows.map(course => ({
        id: course.id,
        name: course.name,
        description: course.description,
        prerequisites: []
      }));

      callback(null, { courses });
    });
  },

  GetCourseById: (call, callback) => {
    const courseId = call.request.id;

    db.get("SELECT * FROM courses WHERE id = ?", [courseId], (err, course) => {
      if (err || !course) return callback(err || { message: "Course not found" });

      db.all("SELECT prerequisite_id FROM prerequisites WHERE course_id = ?", [courseId], (err, prereqRows) => {
        const prerequisites = prereqRows.map(row => row.prerequisite_id);
        callback(null, {
          id: course.id,
          name: course.name,
          description: course.description,
          prerequisites
        });
      });
    });
  },

  EnrollInCourse: (call, callback) => {
    const { user_id, course_id } = call.request;

    db.all("SELECT prerequisite_id FROM prerequisites WHERE course_id = ?", [course_id], (err, prereqRows) => {
      if (err) return callback(err);

      const prerequisites = prereqRows.map(row => row.prerequisite_id);

      if (prerequisites.length === 0) return register();

      const placeholders = prerequisites.map(() => '?').join(',');
      db.all(`SELECT course_id FROM validated_courses WHERE user_id = ? AND course_id IN (${placeholders})`,
        [user_id, ...prerequisites], (err, rows) => {
          if (err) return callback(err);

          const validatedIds = rows.map(row => row.course_id);
          const missing = prerequisites.filter(id => !validatedIds.includes(id));

          if (missing.length > 0) {
            return callback(null, {
              message: `Inscription refusée : prérequis manquants [${missing.join(', ')}]`
            });
          }

          register();
        });

      function register() {
        db.run("INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)", [user_id, course_id], function (err) {
          if (err) return callback(err);
          callback(null, { message: "Inscription réussie." });
        });
      }
    });
  },

  ValidateCourse: (call, callback) => {
    const { user_id, course_id } = call.request;

    db.run("INSERT INTO validated_courses (user_id, course_id) VALUES (?, ?)", [user_id, course_id], function (err) {
      if (err) return callback(err);
      callback(null, { message: "Cours validé avec succès." });
    });
  }
};

module.exports = CourseService;
