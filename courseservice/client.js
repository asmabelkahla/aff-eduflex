const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('course.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const coursePackage = grpcObj.course;

const client = new coursePackage.CourseService('localhost:50052', grpc.credentials.createInsecure());

// 📚 1. Liste des cours
client.ListCourses({}, (err, response) => {
  if (err) return console.error(err);

  console.log("Liste des cours :");
  response.courses.forEach(c => {
    console.log(`- ${c.id} | ${c.name} | ${c.description}`);
  });
});

// 🔍 2. Obtenir un cours par ID
 client.GetCourseById({ id: 1 }, (err, course) => {
  if (err) return console.error(err);
  console.log("Cours :", course);
});

// ✍️ 3. S’inscrire à un cours
client.EnrollInCourse({ user_id: 1, course_id: 1 }, (err, res) => {
  if (err) return console.error(err);
  console.log(res.message);
});
