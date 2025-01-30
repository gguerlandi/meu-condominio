# Sistema de Gestão de Condomínios - Documentação

## Visão Geral
O Sistema de Gestão de Condomínios é uma solução completa para administração de condomínios, oferecendo ferramentas modernas para gestão financeira, controle de moradores e comunicação eficiente. Com interface intuitiva e recursos avançados, o sistema simplifica as tarefas administrativas e oferece transparência para síndicos e moradores.

## Principais Funcionalidades

### 1. Gestão de Condomínios
- **Cadastro Completo**: Registro detalhado de informações do condomínio
- **Múltiplas Unidades**: Suporte para diferentes tipos de condomínios (residencial, comercial ou misto)
- **Áreas Comuns**: Controle de espaços compartilhados e infraestrutura
- **Personalização**: Adaptável a diferentes estruturas e necessidades

### 2. Gestão de Moradores
- **Cadastro de Moradores**: Registro completo com dados pessoais e de contato
- **Gestão de Unidades**: Vinculação de moradores às respectivas unidades
- **Histórico**: Acompanhamento do histórico de ocupação
- **Comunicação**: Canal direto entre administração e moradores

### 3. Gestão Financeira
#### 3.1 Controle de Boletos
- **Geração Automática**: Criação automática de boletos mensais
- **Personalização**: Definição de valores e vencimentos por unidade
- **Segunda Via**: Geração de segunda via com atualização automática
- **Multas e Juros**: Cálculo automático para pagamentos em atraso
- **Status de Pagamento**: Acompanhamento em tempo real
- **Relatórios**: Visualização detalhada da situação financeira

#### 3.2 Fluxo de Caixa
- **Entradas e Saídas**: Registro detalhado de todas as movimentações
- **Categorização**: Organização por tipo de receita/despesa
- **Formas de Pagamento**: Suporte a múltiplas modalidades (dinheiro, PIX, cartão, etc.)
- **Comprovantes**: Anexo de documentos e comprovantes
- **Conciliação**: Ferramentas para conciliação bancária

### 4. Relatórios e Análises
- **Dashboard**: Visão geral em tempo real
- **Inadimplência**: Acompanhamento e gestão
- **Relatórios Financeiros**: Balanços e demonstrativos
- **Relatórios Personalizados**: Geração conforme necessidade
- **Exportação**: Dados em diferentes formatos

### 5. Segurança e Controle
- **Controle de Acesso**: Diferentes níveis de permissão
- **Autenticação Segura**: Proteção por token JWT
- **Registro de Atividades**: Log de todas as operações
- **Backup**: Proteção automática dos dados
- **Conformidade**: Adequação às normas de proteção de dados

## Documentação Técnica

### Estrutura do Backend

#### 1. Autenticação e Segurança
```javascript
// Login
POST /api/login
Body: {
    "email": "admin@exemplo.com",
    "password": "123456"
}
Response: {
    "token": "jwt_token_here"
}
```

Todas as rotas da API requerem autenticação via token JWT no header:
```
Authorization: Bearer jwt_token_here
```

#### 2. Gestão Financeira

##### 2.1 Resumo Financeiro
```javascript
// Obter resumo financeiro
GET /api/financeiro/resumo?condominioId=123&periodo=mes

Response: {
    "periodo": {
        "inicio": "2025-01-01T00:00:00",
        "fim": "2025-01-31T23:59:59"
    },
    "totais": {
        "entradas": 50000.00,
        "saidas": 30000.00,
        "saldo": 20000.00
    },
    "categorias": [...],
    "centrosCusto": [...],
    "fluxoCaixa": [...]
}
```

##### 2.2 Categorias Financeiras
```javascript
// Criar categoria
POST /api/financeiro/categorias
Body: {
    "nome": "Manutenção",
    "tipo": "saida",
    "descricao": "Gastos com manutenção",
    "cor": "#FF0000",
    "orcamentoPrevisto": 5000.00
}

// Listar categorias
GET /api/financeiro/categorias?tipo=saida
```

##### 2.3 Centros de Custo
```javascript
// Criar centro de custo
POST /api/financeiro/centros-custo
Body: {
    "nome": "Área de Lazer",
    "descricao": "Custos da área de lazer",
    "orcamento": 3000.00,
    "responsavel": "João Silva"
}

// Listar centros de custo
GET /api/financeiro/centros-custo
```

##### 2.4 Relatórios Financeiros
```javascript
// Gerar relatório
GET /api/financeiro/relatorios?
    condominioId=123&
    dataInicio=2025-01-01&
    dataFim=2025-01-31&
    tipo=saida&
    categoriaId=456

Response: {
    "periodo": {
        "dataInicio": "2025-01-01",
        "dataFim": "2025-01-31"
    },
    "totais": {
        "entradas": 50000.00,
        "saidas": 30000.00
    },
    "porCategoria": {...},
    "porCentroCusto": {...},
    "transacoes": [...]
}
```

##### 2.5 Previsão Orçamentária
```javascript
// Obter previsão
GET /api/financeiro/previsao-orcamentaria?
    condominioId=123&
    mes=1&
    ano=2025

Response: {
    "periodo": {
        "mes": 1,
        "ano": 2025
    },
    "analise": [
        {
            "categoria": "Manutenção",
            "tipo": "saida",
            "previsto": 5000.00,
            "realizado": 4500.00,
            "diferenca": -500.00,
            "percentualRealizado": 90
        }
    ]
}
```

#### 3. Gestão de Boletos

##### 3.1 Geração de Boletos
```javascript
// Gerar novo boleto
POST /api/boletos
Body: {
    "moradorId": "123",
    "valor": 500.00,
    "vencimento": "2025-02-10"
}

// Listar boletos
GET /api/boletos?status=pendente
```

##### 3.2 Pagamentos
```javascript
// Registrar pagamento
POST /api/boletos/123/pagar
Body: {
    "dataPagamento": "2025-01-30",
    "valorPago": 500.00,
    "formaPagamento": "pix"
}
```

### Modelos de Dados

#### CategoriaFinanceira
```javascript
{
    id: UUID,
    nome: String,
    tipo: ENUM('entrada', 'saida'),
    descricao: String,
    cor: String,
    icone: String,
    orcamentoPrevisto: Decimal
}
```

#### CentroCusto
```javascript
{
    id: UUID,
    nome: String,
    descricao: String,
    orcamento: Decimal,
    status: ENUM('ativo', 'inativo'),
    responsavel: String
}
```

#### Transacao
```javascript
{
    id: UUID,
    tipo: ENUM('entrada', 'saida'),
    valor: Decimal,
    data: Date,
    descricao: String,
    categoriaFinanceiraId: UUID,
    centroCustoId: UUID,
    status: ENUM('pendente', 'confirmado', 'cancelado'),
    comprovante: String
}
```

### Configuração do Ambiente

1. **Requisitos**:
   - Node.js 14+
   - MySQL 8+
   - NPM ou Yarn

2. **Variáveis de Ambiente** (.env):
```
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=condominio
DB_PORT=3306
JWT_SECRET=seu_secret_key
JWT_EXPIRATION=1h
PORT=3000
```

3. **Instalação**:
```bash
# Instalar dependências
npm install

# Inicializar banco de dados
npm run db:init

# Iniciar servidor em desenvolvimento
npm run dev

# Iniciar servidor em produção
npm start
```

### Boas Práticas e Padrões

1. **Segurança**:
   - Todas as rotas são protegidas por JWT
   - Senhas são hasheadas com bcrypt
   - Validação de entrada em todas as rotas
   - Sanitização de dados

2. **Performance**:
   - Índices otimizados no banco de dados
   - Paginação em listagens grandes
   - Cache de consultas frequentes
   - Compressão de respostas

3. **Manutenção**:
   - Código modular e organizado
   - Documentação clara e atualizada
   - Logs detalhados
   - Testes automatizados

## Benefícios

### Para a Administração
- **Eficiência**: Automatização de tarefas rotineiras
- **Controle**: Visão completa da gestão do condomínio
- **Organização**: Centralização de informações
- **Economia**: Redução de custos operacionais
- **Transparência**: Facilidade na prestação de contas

### Para os Moradores
- **Praticidade**: Acesso a boletos e informações
- **Comunicação**: Canal direto com a administração
- **Transparência**: Acompanhamento da gestão
- **Comodidade**: Serviços online 24/7
- **Segurança**: Proteção de dados pessoais

## Especificações Técnicas

### Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript moderno
- **Backend**: Node.js com Express
- **Banco de Dados**: MySQL
- **Segurança**: JWT, HTTPS, Bcrypt
- **Interface**: Design responsivo e moderno

### Requisitos do Sistema
- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Conexão**: Internet banda larga
- **Servidor**: Node.js 14+ e MySQL 8+
- **Armazenamento**: Conforme volume de dados

## Suporte e Manutenção
- Atualizações regulares de segurança
- Suporte técnico especializado
- Treinamento para usuários
- Backup regular dos dados
- Monitoramento 24/7

## Customização e Escalabilidade
- Sistema modular e adaptável
- Possibilidade de integrações
- Personalização conforme necessidade
- Suporte a crescimento futuro
- Atualizações constantes

## Implementação e Treinamento
1. **Análise Inicial**
   - Levantamento de requisitos
   - Planejamento de implementação
   - Definição de cronograma

2. **Configuração**
   - Instalação do sistema
   - Configuração inicial
   - Importação de dados existentes

3. **Treinamento**
   - Capacitação da equipe
   - Material de apoio
   - Suporte inicial intensivo

4. **Acompanhamento**
   - Monitoramento pós-implementação
   - Ajustes necessários
   - Suporte contínuo

## Conclusão
O Sistema de Gestão de Condomínios é uma solução completa e moderna que atende às necessidades de administração condominial, oferecendo eficiência, segurança e praticidade para gestores e moradores. Com sua interface intuitiva e recursos avançados, proporciona uma gestão mais eficiente e transparente do condomínio.
