const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const app = express();
app.use(express.json());

const packageDef = protoLoader.loadSync('course.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const client = new grpcObj.course.CourseService('localhost:50051', grpc.credentials.createInsecure());

// ✅ REST → gRPC : GET /courses
// Cette route permet de lister tous les cours disponibles
app.get('/courses', (req, res) => {
  client.ListCourses({}, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response.courses);
  });
});
// ✅ REST → gRPC : POST /validate
// Cette route permet de valider un cours pour un utilisateur donné
// Elle prend en entrée l’ID de l’utilisateur et l’ID du cours
// Elle renvoie un message indiquant si la validation a réussi ou non
app.post('/validate', (req, res) => {
    const { user_id, course_id } = req.body;
  
    client.ValidateCourse({ user_id, course_id }, (err, response) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: response.message });
    });
  });
  
  
// 🔍 REST → gRPC : GET /courses/:id
// Cette route permet d’obtenir les détails d’un cours par son ID
// Elle renvoie le nom, la description et les prérequis du cours
app.get('/courses/:id', (req, res) => {
  client.GetCourseById({ id: parseInt(req.params.id) }, (err, course) => {
    if (err) return res.status(404).json({ error: "Cours non trouvé" });
    res.json(course);
  });
});

// ✍️ REST → gRPC : POST /enroll
// Cette route permet de s’inscrire à un cours
// Elle vérifie d’abord si l’utilisateur a validé tous les prérequis du cours
// Elle renvoie un message indiquant si l’inscription a réussi ou non
app.post('/enroll', (req, res) => {
  const { user_id, course_id } = req.body;
  client.EnrollInCourse({ user_id, course_id }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: response.message });
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`API Gateway REST en ligne : http://localhost:${PORT}`));
