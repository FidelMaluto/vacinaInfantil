// URL DA API
const API = 'http://localhost:3000';


// =========================================
// LOGIN
// =========================================
async function entrar() {

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert('Preencha todos os campos');
    return;
  }

  try {

    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await response.json();

    if (resultado.erro) {
      alert(resultado.erro);
      return;
    }

    alert(resultado.mensagem);

    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('sistema').classList.remove('hidden');

    listarVacinas();
    listarCriancas();
    carregarDashboard();

  } catch (erro) {
    console.log(erro);
    alert('Erro ao fazer login');
  }
}


// =========================================
// CADASTRAR VACINA (UPLOAD)
// =========================================
async function cadastrarVacina() {

  const imagemFile = document.getElementById('imagemVacina').files[0];

  const formData = new FormData();

  formData.append('nome', document.getElementById('nomeVacina').value);
  formData.append('descricao', document.getElementById('descricaoVacina').value);
  formData.append('idade_recomendada', document.getElementById('idadeVacina').value);
  formData.append('cuidados', document.getElementById('cuidadosVacina').value);

  if (imagemFile) {
    formData.append('imagem', imagemFile);
  }

  try {

    const response = await fetch(`${API}/vacinas`, {
      method: 'POST',
      body: formData
    });

    const resultado = await response.json();

    alert(resultado.mensagem || 'Vacina cadastrada');

    listarVacinas();

  } catch (erro) {
    console.log(erro);
    alert('Erro ao cadastrar vacina');
  }
}


// =========================================
// CADASTRAR USUÁRIO (CORRIGIDO)
// =========================================
async function cadastrarUsuario() {

  const dados = {

    nome: document.getElementById('nome').value,
    email: document.getElementById('emailCadastro').value,
    telefone: document.getElementById('telefone').value,
    senha: document.getElementById('senhaCadastro').value,
    tipo: 'pai'

  };

  try {

    const response = await fetch(`${API}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    alert(resultado.mensagem);

  } catch (erro) {
    console.log(erro);
    alert('Erro ao cadastrar usuário');
  }
}


// =========================================
// CADASTRAR CRIANÇA
// =========================================
async function cadastrarCrianca() {

  const dados = {

    usuario_id: document.getElementById('usuario_id').value,
    nome: document.getElementById('nomeCrianca').value,
    nascimento: document.getElementById('nascimento').value,
    sexo: document.getElementById('sexo').value

  };

  try {

    const response = await fetch(`${API}/criancas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    alert(resultado.mensagem);

    listarCriancas();
    carregarDashboard();

  } catch (erro) {
    console.log(erro);
    alert('Erro ao cadastrar criança');
  }
}


// =========================================
// LISTAR VACINAS (CORRIGIDO IMAGEM)
// =========================================
async function listarVacinas() {

  try {

    const response = await fetch(`${API}/vacinas`);
    const vacinas = await response.json();

    const container = document.getElementById('listaVacinas');

    container.innerHTML = '';

    vacinas.forEach(vacina => {

      const img = vacina.imagem
        ? `http://localhost:3000/img/${vacina.imagem}`
        : 'img/default.png';

      container.innerHTML += `

                <div class="vacina-card">

                    <img src="${img}" width="100%">

                    <div class="vacina-info">

                        <h3>${vacina.nome || ''}</h3>
                        <p>${vacina.descricao || ''}</p>

                        <p><strong>Idade:</strong> ${vacina.idade_recomendada || ''}</p>
                        <p><strong>Cuidados:</strong> ${vacina.cuidados || ''}</p>

                    </div>

                </div>

            `;

    });

  } catch (erro) {
    console.log(erro);
  }
}


// =========================================
// LISTAR CRIANÇAS (PROTEÇÃO UNDEFINED)
// =========================================
async function listarCriancas() {

  try {

    const response = await fetch(`${API}/criancas`);
    const criancas = await response.json();

    const container = document.getElementById('listaCriancas');

    container.innerHTML = '';

    criancas.forEach(crianca => {

      container.innerHTML += `

                <div class="card">

                    <h3>👶 ${crianca.nome || ''}</h3>

                    <p>Responsável: ${crianca.responsavel || ''}</p>
                    <p>Sexo: ${crianca.sexo || ''}</p>
                    <p>Nascimento: ${crianca.nascimento || ''}</p>

                </div>

            `;

    });

  } catch (erro) {
    console.log(erro);
  }
}


// =========================================
// DASHBOARD (PROTEGIDO)
// =========================================
async function carregarDashboard() {

  try {

    const criancasRes = await fetch(`${API}/criancas`);
    const criancas = await criancasRes.json();

    document.getElementById('totalCriancas').innerText = criancas.length || 0;

    const vacRes = await fetch(`${API}/vacinacoes`);
    const vacinacoes = await vacRes.json();

    document.getElementById('totalVacinas').innerText = vacinacoes.length || 0;

    const atrasadas = vacinacoes.filter(v => v.status === 'Atrasada');
    document.getElementById('vacinasAtrasadas').innerText = atrasadas.length || 0;

    const hoje = new Date();

    const proximas = vacinacoes.filter(v => {

      if (!v.proxima_dose) return false;

      const data = new Date(v.proxima_dose);
      const diff = (data - hoje) / (1000 * 60 * 60 * 24);

      return diff >= 0 && diff <= 7;

    });

    document.getElementById('proximasVacinas').innerText = proximas.length || 0;

  } catch (erro) {
    console.log(erro);
  }
}


// =========================================
// ENVIAR EMAIL
// =========================================
async function enviarEmail() {

  const dados = {

    email: document.getElementById('emailResponsavel').value,
    nomeCrianca: document.getElementById('nomeCriancaEmail').value,
    vacina: document.getElementById('vacinaEmail').value,
    data: document.getElementById('dataVacina').value

  };

  try {

    const response = await fetch(`${API}/enviar-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    alert(resultado.mensagem);

  } catch (erro) {
    console.log(erro);
    alert('Erro ao enviar email');
  }

}
