// Importa as dependências
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Cria uma instância do servidor Express
const app = express();

// Configura o middleware body-parser
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // substitua pelo seu usuário
  database: 'gerenciamento_tarefas' // substitua pelo nome do seu banco de dados
});

// Conecta-se ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar-se ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados MariaDB bem-sucedida');
});

// Define o endpoint para obter todas as tarefas
app.get('/tasks', (req, res) => {
  connection.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      console.error('Erro ao obter tarefas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    res.json(results);
  });
});

// Define o endpoint para criar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { description, dueDate, status } = req.body;
  connection.query('INSERT INTO tasks (description, dueDate, status) VALUES (?, ?, ?)', [description, dueDate, status], (error, results) => {
    if (error) {
      console.error('Erro ao criar uma nova tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    res.json({ message: 'Nova tarefa criada com sucesso', taskId: results.insertId });
  });
});
// Define o endpoint para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { description, dueDate, status } = req.body;
    connection.query('UPDATE tasks SET description = ?, dueDate = ?, status = ? WHERE id = ?', [description, dueDate, status, taskId], (error, results) => {
      if (error) {
        console.error('Erro ao atualizar a tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.json({ message: 'Tarefa atualizada com sucesso', taskId: taskId });
    });
  });
// Define o endpoint para excluir uma tarefa
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    connection.query('DELETE FROM tasks WHERE id = ?', [taskId], (error, results) => {
      if (error) {
        console.error('Erro ao excluir a tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.json({ message: 'Tarefa excluída com sucesso', taskId: taskId });
    });
  });
    

// Inicia o servidor na porta especificada
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
