const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/admin/userRoutes');
const courseRoutes = require('./routes/admin/courseRoutes');
const semesterRoutes = require('./routes/admin/semesterRoutes');
const subjectRoutes = require('./routes/admin/subjectRoutes');
const schoolSaturdaysRoutes = require('./routes/admin/schoolSaturdaysRoutes');
const User = require('./models/admin/User');
const Course = require('./models/admin/Course');
const SchoolSaturday = require('./models/admin/SchoolSaturday');
const Semester = require('./models/admin/Semester');

const app = express();


dotenv.config();

app.use(cors()); // Usa o middleware CORS

app.use(express.json());

app.use('/api/auth', authRoutes);

//Rotas do ADMIN
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', semesterRoutes);
app.use('/api', subjectRoutes);
app.use('/api', schoolSaturdaysRoutes);

// Função para criar o usuário administrador, se não existir
const createAdminIfNotExists = async () => {
    const adminExists = await User.findOne({ where: { accessType: 'admin' } });
  
    if (!adminExists) {
      // Criar o usuário administrador com dados pré-definidos
      await User.create({
        username: 'admin',
        email: 'diren.cedro@ifce.edu.br',
        password: '123456',  // A senha será automaticamente hasheada
        accessType: 'admin',
      });
      console.log('Administrador criado com sucesso!');
    }
  };

// Defina as associações após a importação dos modelos
Course.belongsTo(User, { as: 'coordinator', foreignKey: 'coordinatorId' });
SchoolSaturday.belongsTo(Semester, {as: 'semester', foreignKey: 'semesterId'})

sequelize.sync({ force: false }) // force: false para não apagar os dados existentes
  .then(async () => {
    await createAdminIfNotExists();  // Verifica e cria o admin se necessário
    app.listen(3000, () => console.log('API rodando na porta 3000'));
  })
  .catch((error) => console.error('Erro ao sincronizar o banco de dados:', error));