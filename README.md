# 📝 Todo List - Lista de Tarefas Moderna

Uma aplicação web completa para gerenciamento de tarefas com sincronização na nuvem, temas personalizáveis e exportação de dados.

## ✨ Funcionalidades

### 🎯 Funcionalidades Básicas
- ✅ **Adicionar tarefas** com texto personalizado
- ☑️ **Marcar como concluída** com checkbox
- ✏️ **Editar tarefas** existentes
- 🗑️ **Remover tarefas** indesejadas
- 🏷️ **Categorias**: Pessoal, Trabalho, Estudos, Casa
- ⭐ **Prioridades**: Alta, Média, Baixa (com cores visuais)
- 📅 **Data de vencimento** para organização temporal

### 🔍 Funcionalidades Intermediárias
- 📊 **Filtros avançados**: Todas, Pendentes, Concluídas, Por categoria
- 📈 **Contador inteligente**: Total, Pendentes, Concluídas com animações
- 🎨 **Temas claro/escuro** com detecção automática do sistema
- 💾 **Exportação**: PDF profissional e TXT formatado
- 🔍 **Busca em tempo real** por texto

### 🚀 Funcionalidades Avançadas
- 🔄 **Sincronização com Google Drive** para backup na nuvem
- 📱 **Design responsivo** otimizado para mobile
- 💿 **Armazenamento local** (localStorage) para funcionamento offline
- ⚡ **Interface fluida** com animações e transições suaves
- 🎯 **Compatibilidade** com dados antigos

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e moderna
- **CSS3**: Variáveis CSS, Flexbox, Animações, Media Queries
- **JavaScript ES6+**: Módulos, Arrow Functions, Template Literals
- **Google Drive API**: Sincronização e backup na nuvem
- **jsPDF**: Geração de PDFs no cliente
- **localStorage**: Persistência de dados offline

## 🚀 Como Usar

### 1. Acesso Online
Acesse diretamente: **[https://samaramirandda.github.io/todo-list/](https://samaramirandda.github.io/todo-list/)**

### 2. Instalação Local

```bash
# Clone o repositório
git clone https://github.com/samaramirandda/todo-list.git

# Entre na pasta
cd todo-list

# Inicie um servidor local
python3 -m http.server 8000

# Acesse no navegador
http://localhost:8000
```

### 3. Uso Básico

1. **Adicionar Tarefa**: Digite no campo e pressione Enter ou clique "Add"
2. **Marcar Concluída**: Clique no checkbox ☑️
3. **Editar**: Clique no ícone ✏️
4. **Remover**: Clique no ícone 🗑️
5. **Filtrar**: Use os botões ou dropdown de categoria
6. **Buscar**: Digite no campo de busca 🔍

### 4. Funcionalidades Avançadas

#### 🎨 Alternar Tema
- Clique no botão **"🌙 Escuro"** ou **"☀️ Claro"**
- Detecção automática da preferência do sistema
- Preferência salva para próximas visitas

#### 💾 Exportar Dados
- Clique em **"💾 Exportar"**
- Escolha **PDF** para formato profissional
- Escolha **TXT** para formato simples
- Arquivos incluem estatísticas e data de exportação

#### 🔄 Sincronização (Requer Configuração)
- Clique em **"🔄 Sync"**
- Configure Google Drive (veja instruções abaixo)
- **"⬆️ Enviar"**: Backup para nuvem
- **"⬇️ Baixar"**: Restaurar da nuvem

## ⚙️ Configuração da Sincronização

Para usar a sincronização com Google Drive, siga o guia completo:

👉 **[Instruções de Configuração](GOOGLE_DRIVE_SETUP.md)**

Resumo rápido:
1. Criar projeto no Google Cloud Console
2. Ativar Google Drive API
3. Criar credenciais OAuth 2.0
4. Configurar no código

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dispositivos
- 💻 **Desktop**: Experiência completa
- 📱 **Mobile**: Interface adaptada e responsiva
- 📟 **Tablet**: Layout otimizado

## 🗂️ Estrutura do Projeto

```
todo-list/
├── index.html              # Página principal
├── styles/
│   └── style.css           # Estilos e temas
├── scripts/
│   └── script.js           # Lógica da aplicação
├── assets/
│   └── favicon.ico         # Ícone do site
├── README.md               # Este arquivo
└── GOOGLE_DRIVE_SETUP.md   # Guia de configuração
```

## 👨‍💻 Desenvolvido por

**Samara Miranda**
- GitHub: [@samaramirandda](https://github.com/samaramirandda)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

⭐ **Se este projeto te ajudou, deixe uma estrela no GitHub!**