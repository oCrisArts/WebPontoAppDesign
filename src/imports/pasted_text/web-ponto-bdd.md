# WebPonto — Implementação Funcional via BDD

## Objetivo

Atualizar o protótipo existente do WebPonto no Figma Make para que os fluxos funcionem como um aplicativo real de controle de ponto.

**Prioridade:** comportamento, navegação, estados e persistência dos dados.

**IMPORTANTE:** não redesenhar, reorganizar ou alterar o visual existente. Manter componentes, layout, tipografia, cores, espaçamentos, ícones e identidade visual atuais. Alterar apenas o necessário para implementar ou corrigir funcionalidades.

---

## Regras gerais de implementação

* Todas as interações devem funcionar de forma navegável.
* Dados criados pelo usuário devem permanecer disponíveis durante a sessão.
* Atualizações devem refletir imediatamente nas telas relacionadas.
* Botões e componentes devem possuir estados coerentes: padrão, ativo, desabilitado, sucesso e erro quando aplicável.
* Usar o horário atual do dispositivo para novos registros de ponto.
* Não criar funcionalidades que não estejam especificadas abaixo.
* Não substituir telas existentes por versões simplificadas.
* Manter a arquitetura visual atual.
* Corrigir comportamentos existentes que estejam inconsistentes com as regras abaixo.

---

# ⚙️ Funcionalidades Comuns — Header e Menu Inferior

### Funcionalidade: Navegação Básica

**Para** acessar dados pessoais, alertas e outras áreas do app
**Eu, como** Usuário
**Desejo** usar o cabeçalho e rodapé para navegar rapidamente

### Cenário 1: Acessar Perfil

* **Dado que** visualizo o cabeçalho do app
* **Quando** clico no ícone de Usuário
* **Então** o sistema abre a tela de edição de perfil e senha.
* **E** os dados atuais do usuário permanecem preenchidos.

### Cenário 2: Acessar Notificações

* **Dado que** visualizo o cabeçalho do app
* **Quando** clico no ícone de Sino
* **Então** o sistema exibe os alertas recentes.
* **E** os alertas devem permanecer acessíveis até serem visualizados ou dispensados.

### Cenário 3: Acessar Menu Secundário

* **Dado que** visualizo o menu inferior
* **Quando** clico na opção "Mais"
* **Então** o sistema exibe as configurações e a opção de sair.

### Cenário 4: Navegação inferior

* **Dado que** estou em qualquer tela que utilize o menu inferior
* **Quando** clico em uma opção de navegação
* **Então** o sistema abre a tela correspondente.
* **E** a opção atualmente selecionada deve permanecer visualmente identificada.

---

# 📱 Perfil: Funcionário

## Funcionalidade: Controle de Ponto

**Para** registrar minha jornada sem erros
**Eu, como** Funcionário
**Desejo** bater ponto e consultar meus registros com poucos cliques

### Cenário 1: Registrar Ponto

* **Dado que** estou na tela "Home"
* **Quando** clico no botão "Bater Ponto"
* **Então** o sistema registra a data e hora atual.
* **E** adiciona o registro em "Registros de hoje".
* **E** atualiza imediatamente o estado da jornada.
* **E** o botão deve refletir a próxima ação disponível.

### Cenário 2: Registrar múltiplas marcações

* **Dado que** já existe uma marcação registrada hoje
* **Quando** clico novamente em "Bater Ponto"
* **Então** o sistema registra uma nova marcação com o horário atual.
* **E** mantém todas as marcações anteriores.
* **E** organiza os registros cronologicamente.

### Cenário 3: Visualizar jornada atual

* **Dado que** existem marcações registradas no dia
* **Quando** visualizo "Registros de hoje"
* **Então** o sistema exibe todas as marcações realizadas.
* **E** calcula o estado atual da jornada com base na sequência das marcações.

### Cenário 4: Detalhar Calendário

* **Dado que** visualizo a seção "Calendário" na tela "Home"
* **Quando** clico em "Detalhar"
* **Então** o sistema abre a visão detalhada do calendário.
* **E** exibe banco de horas e feriados.
* **E** mantém os dados da jornada sincronizados.

### Cenário 5: Consultar Histórico

* **Dado que** sou Funcionário
* **Quando** acesso "Histórico"
* **Então** o sistema exibe os registros de ponto anteriores.
* **E** permite selecionar um dia específico.

### Cenário 6: Solicitar Ajuste

* **Dado que** naveguei para a tela "Histórico"
* **E** selecionei um dia específico
* **Quando** clico em "Ajustar"
* **Então** o sistema exibe o formulário de correção de horário.
* **E** o formulário deve apresentar os registros existentes daquele dia.
* **Quando** envio a solicitação
* **Então** o sistema registra a solicitação como pendente.

---

# 🛠️ Perfil: Administrador

## Funcionalidade: Gestão da Equipe

**Para** acompanhar a assiduidade e exportar dados
**Eu, como** Administrador
**Desejo** analisar o painel gerencial e gerar documentos

### Cenário 1: Expandir Gráfico de Horas

* **Dado que** estou na tela "Dashboard"
* **Quando** clico em "Detalhar" no gráfico de "Horas Trabalhadas"
* **Então** o sistema exibe os números exatos e métricas individuais.
* **E** os dados devem corresponder aos registros disponíveis da equipe.

### Cenário 2: Listar Atividades

* **Dado que** visualizo a seção "Atividade Recente"
* **Quando** clico em "Ver tudo"
* **Então** o sistema abre a lista completa de marcações da equipe no dia.
* **E** os registros devem apresentar funcionário, horário e tipo de marcação.

### Cenário 3: Filtrar dados

* **Dado que** estou visualizando dados da equipe
* **Quando** seleciono um período disponível
* **Então** o sistema atualiza os dados exibidos para o período selecionado.
* **E** gráficos, métricas e listas devem permanecer consistentes.

### Cenário 4: Exportar Folha

* **Dado que** naveguei para a tela "Relatórios"
* **Quando** seleciono o mês e clico em "Exportar"
* **Então** o sistema gera a planilha com os pontos consolidados.
* **E** o arquivo deve conter os registros correspondentes ao período selecionado.
* **E** o download deve ser iniciado.

---

# 🔐 Perfis e permissões

### Cenário 1: Funcionário

* **Dado que** o usuário possui perfil Funcionário
* **Então** ele pode acessar Home, Histórico, Calendário, Perfil, Notificações e configurações.
* **E** não deve acessar funcionalidades exclusivas de Administrador.

### Cenário 2: Administrador

* **Dado que** o usuário possui perfil Administrador
* **Então** ele pode acessar Dashboard, Equipe, Atividades, Relatórios, Perfil, Notificações e configurações.

---

# 💾 Estado e consistência dos dados

* Uma marcação criada deve permanecer disponível ao navegar entre telas.
* O Histórico deve refletir as marcações realizadas na Home.
* Dashboard e métricas devem utilizar os mesmos dados disponíveis para a equipe.
* Alterações de perfil devem refletir imediatamente onde o usuário é identificado.
* Solicitações de ajuste devem permanecer registradas como pendentes.
* Não utilizar dados fictícios diferentes para cada tela quando o dado representar a mesma entidade.
* Sempre que possível, centralizar o estado dos dados para evitar inconsistências entre telas.

---

# ✅ Critérios de aceite

A implementação estará correta quando:

1. Todas as navegações especificadas funcionarem.
2. "Bater Ponto" registrar efetivamente o horário atual.
3. Novas marcações aparecerem imediatamente nos registros.
4. Histórico e Home permanecerem sincronizados.
5. Solicitações de ajuste puderem ser criadas.
6. Dashboard refletir os dados disponíveis.
7. Relatórios puderem ser gerados para o período selecionado.
8. Funcionário e Administrador possuírem permissões diferentes.
9. Nenhuma interação existente for quebrada.
10. O design visual atual permanecer inalterado.

**FOCO FINAL:** transformar o protótipo existente em um protótipo funcional e consistente, sem alterar sua interface visual. Priorizar lógica, estados, navegação, dados e comportamento realista do produto.
