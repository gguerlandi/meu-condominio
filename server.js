const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware para verificar autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, 'seu_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rota de login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Aqui você implementaria a verificação real com banco de dados
    if (email === 'admin@exemplo.com' && password === 'senha123') {
        const token = jwt.sign({ email }, 'seu_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

// Rota para cadastro de condomínio
app.post('/api/condominios', authenticateToken, (req, res) => {
    const { nome, endereco, numero, unidades } = req.body;

    // Aqui você implementaria a lógica de salvamento no banco de dados
    // Por enquanto, vamos apenas simular um sucesso
    try {
        // Simulando validação
        if (!nome || !endereco || !numero || !unidades) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Simulando salvamento
        res.status(201).json({ 
            message: 'Condomínio cadastrado com sucesso',
            condominio: { nome, endereco, numero, unidades }
        });
    } catch (error) {
        console.error('Erro ao cadastrar condomínio:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para listar condominios
app.get('/api/condominios', authenticateToken, (req, res) => {
    // Simulando lista de condominios
    const condominios = [
        { id: 1, nome: 'Residencial Flores' },
        { id: 2, nome: 'Edifício Solar' }
    ];
    res.json(condominios);
});

// Rota para cadastro de morador
app.post('/api/moradores', authenticateToken, (req, res) => {
    const { 
        nome, 
        telefone, 
        email, 
        condominio_id, 
        unidade, 
        vencimento, 
        valor 
    } = req.body;

    try {
        // Validações
        if (!nome || !telefone || !email || !condominio_id || !unidade || !vencimento || !valor) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'E-mail inválido' });
        }

        // Validar vencimento
        if (vencimento < 1 || vencimento > 31) {
            return res.status(400).json({ message: 'Data de vencimento inválida' });
        }

        // Simulando salvamento
        res.status(201).json({
            message: 'Morador cadastrado com sucesso',
            morador: { nome, telefone, email, condominio_id, unidade, vencimento, valor }
        });
    } catch (error) {
        console.error('Erro ao cadastrar morador:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para listar boletos
app.get('/api/boletos', authenticateToken, (req, res) => {
    // Simulando lista de boletos
    const boletos = [
        {
            id: 1,
            morador: 'João Silva',
            unidade: '101',
            valor: 500.00,
            vencimento: '2024-03-10',
            status: 'pendente'
        },
        {
            id: 2,
            morador: 'Maria Santos',
            unidade: '102',
            valor: 500.00,
            vencimento: '2024-02-10',
            status: 'pago'
        },
        {
            id: 3,
            morador: 'Pedro Souza',
            unidade: '103',
            valor: 500.00,
            vencimento: '2024-01-10',
            status: 'atrasado'
        }
    ];
    res.json(boletos);
});

// Rota para gerar novo boleto
app.post('/api/boletos', authenticateToken, (req, res) => {
    const { morador_id, valor, vencimento } = req.body;

    try {
        // Validações
        if (!morador_id || !valor || !vencimento) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Simulando geração de boleto
        res.status(201).json({
            message: 'Boleto gerado com sucesso',
            boleto: { morador_id, valor, vencimento, status: 'pendente' }
        });
    } catch (error) {
        console.error('Erro ao gerar boleto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para enviar boletos por email
app.post('/api/boletos/enviar', authenticateToken, (req, res) => {
    const { boletos } = req.body;

    try {
        // Simulando envio de email
        res.json({ message: `${boletos.length} boletos enviados com sucesso` });
    } catch (error) {
        console.error('Erro ao enviar boletos:', error);
        res.status(500).json({ message: 'Erro ao enviar boletos' });
    }
});

// Rota para marcar boleto como pago
app.post('/api/boletos/:id/pagar', authenticateToken, (req, res) => {
    const { id } = req.params;

    try {
        // Simulando registro de pagamento
        res.json({ message: 'Pagamento registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        res.status(500).json({ message: 'Erro ao registrar pagamento' });
    }
});

// Rota para dados dos relatórios
app.get('/api/relatorios', authenticateToken, (req, res) => {
    const { mes, condominio } = req.query;

    // Simulando dados do relatório
    const dados = {
        totalReceitas: 50000.00,
        totalDespesas: 35000.00,
        taxaInadimplencia: 15.5,
        contasPagar: [
            {
                fornecedor: 'Empresa de Limpeza',
                vencimento: '2024-03-15',
                valor: 3000.00,
                status: 'pendente'
            },
            {
                fornecedor: 'Manutenção Elevadores',
                vencimento: '2024-03-10',
                valor: 2500.00,
                status: 'pago'
            }
        ],
        inadimplentes: [
            {
                morador: 'João Silva',
                unidade: '101',
                valor: 1500.00,
                diasAtraso: 15
            },
            {
                morador: 'Maria Santos',
                unidade: '302',
                valor: 1500.00,
                diasAtraso: 30
            }
        ]
    };

    res.json(dados);
});

// Rota para dados do dashboard
app.get('/api/dashboard', authenticateToken, (req, res) => {
    const { condominio } = req.query;

    // Simulando dados do dashboard
    const dados = {
        totalMoradores: 48,
        totalRecebido: 24000.00,
        totalReceber: 6000.00,
        taxaInadimplencia: 12.5,
        historicoMensal: [22000, 23000, 21000, 24000, 23500, 24000],
        ultimosPagamentos: [
            {
                morador: 'João Silva',
                unidade: '101',
                valor: 500.00,
                status: 'pago'
            },
            {
                morador: 'Maria Santos',
                unidade: '102',
                valor: 500.00,
                status: 'pendente'
            },
            {
                morador: 'Pedro Souza',
                unidade: '103',
                valor: 500.00,
                status: 'atrasado'
            }
        ]
    };

    res.json(dados);
});

// Rota para enviar comunicados
app.post('/api/comunicados', authenticateToken, (req, res) => {
    const { titulo, mensagem, enviarTodos, condominio_id } = req.body;

    try {
        // Validações
        if (!titulo || !mensagem || !condominio_id) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Simulando envio de comunicado
        res.status(201).json({ 
            message: 'Comunicado enviado com sucesso',
            comunicado: { titulo, mensagem, enviarTodos, condominio_id }
        });
    } catch (error) {
        console.error('Erro ao enviar comunicado:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 