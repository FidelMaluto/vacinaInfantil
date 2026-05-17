// URL API
const API = 'http://localhost:3000';

// AUTO LOGIN

window.onload = () => {

  const logado = localStorage.getItem('logado');

  if (logado === 'true') {

    mostrarSistema();

  }

};


// MOSTRAR SISTEMA

function mostrarSistema() {

  document
    .getElementById('loginPage')
    .style.display = 'none';

  document
    .getElementById('sistema')
    .style.display = 'block';

  listarVacinas();
  listarCriancas();
  carregarDashboard();
  carregarNotificacoes();
  carregarNotificacoes();

}


// LOGIN

async function entrar() {

  const email =
    document.getElementById('email').value;

  const senha =
    document.getElementById('senha').value;

  if (!email || !senha) {

    alert('Preencha todos os campos');
    return;

  }

  try {

    const response =
      await fetch(`${API}/login`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          senha
        })

      });

    const resultado =
      await response.json();

    if (resultado.erro) {

      alert(resultado.erro);
      return;

    }

    localStorage.setItem('logado', 'true');

    alert('Login realizado com sucesso');

    mostrarSistema();

  } catch (erro) {

    console.log(erro);

    alert('Erro ao fazer login');

  }

}


// CADASTRAR RESPONSÁVEL

async function cadastrarUsuario() {

  const dados = {

    nome:
      document.getElementById('nomeResponsavel').value,

    email:
      document.getElementById('emailCadastro').value,

    telefone:
      document.getElementById('telefone').value,

    senha:
      document.getElementById('senhaCadastro').value,

    tipo: 'pai'

  };

  try {

    const response =
      await fetch(`${API}/usuarios`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(dados)

      });

    const resultado =
      await response.json();

    alert(resultado.mensagem);

  } catch (erro) {

    console.log(erro);

    alert('Erro ao cadastrar responsável');

  }

}


// CADASTRAR CRIANÇA

async function cadastrarCrianca() {

  const dados = {

    usuario_id:
      document.getElementById('usuario_id').value,

    nome:
      document.getElementById('nomeCrianca').value,

    nascimento:
      document.getElementById('nascimento').value,

    sexo:
      document.getElementById('sexo').value

  };

  try {

    const response =
      await fetch(`${API}/criancas`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(dados)

      });

    const resultado =
      await response.json();

    alert(resultado.mensagem);

    listarCriancas();

    carregarDashboard();

  } catch (erro) {

    console.log(erro);

    alert('Erro ao cadastrar criança');

  }

}

// CADASTRAR VACINA
async function cadastrarVacina() {

  const formData = new FormData();

  formData.append(
    'nome',
    document.getElementById('nome').value
  );

  formData.append(
    'descricao',
    document.getElementById('descricao').value
  );

  formData.append(
    'idade_recomendada',
    document.getElementById('idade').value
  );

  formData.append(
    'cuidados',
    document.getElementById('cuidados').value
  );

  const imagem =
    document.getElementById('imagem').files[0];

  if (imagem) {

    formData.append('imagem', imagem);

  }

  try {

    const response = await fetch(`${API}/vacinas`, {

      method: 'POST',
      body: formData

    });

    const resultado = await response.json();

    alert(resultado.mensagem);

    listarVacinas();

  } catch (erro) {

    console.log(erro);

    alert('Erro ao cadastrar vacina');

  }

}


// LISTAR VACINAS

async function listarVacinas() {
  try {
    const response =
      await fetch(`${API}/vacinas`);

    const vacinas =
      await response.json();

    const container =
      document.getElementById('listaVacinas');

    container.innerHTML = '';

    vacinas.forEach(vacina => {

      const imagem = vacina.imagem
        ? `${API}/img/${vacina.imagem}`
        : 'img/default.png';

      container.innerHTML += `

                <div class="vacina-card">

                    <img src="${imagem}" alt="${vacina.nome}">

                    <div class="vacina-info">

                        <h3>
                            ${vacina.nome ?? ''}
                        </h3>

                        <p>
                            ${vacina.descricao ?? ''}
                        </p>

                        <p>
                            <strong>Idade:</strong>
                            ${vacina.idade_recomendada ?? ''}
                        </p>

                        <p>
                            <strong>Cuidados:</strong>
                            ${vacina.cuidados ?? ''}
                        </p>

                    </div>

                </div>

            `;

    });

  } catch (erro) {
    console.log(erro);
  }

}

// LISTAR CRIANÇAS

async function listarCriancas() {
  try {
    const response =
      await fetch(`${API}/criancas`);

    const criancas =
      await response.json();

    const container =
      document.getElementById('listaCriancas');

    container.innerHTML = '';

    criancas.forEach(crianca => {

      container.innerHTML += `

                <div class="card">

                    <h3>
                        👶 ${crianca.nome ?? ''}
                    </h3>

                    <p>
                        Responsável:
                        ${crianca.responsavel ?? 'N/A'}
                    </p>

                    <p>
                        Sexo:
                        ${crianca.sexo ?? 'N/A'}
                    </p>

                    <p>
                        Nascimento:
                        ${crianca.nascimento ?? 'N/A'}
                    </p>

                </div>

            `;

    });

  } catch (erro) {
    console.log(erro);
  }

}

// DASHBOARD

async function carregarDashboard() {
  try {
    // CRIANÇAS
    const responseCriancas =
      await fetch(`${API}/criancas`);

    const criancas =
      await responseCriancas.json();

    document
      .getElementById('totalCriancas')
      .innerText = criancas.length;

    // VACINAS

    const responseVacinas =
      await fetch(`${API}/vacinas`);

    const vacinas =
      await responseVacinas.json();

    document
      .getElementById('totalVacinas')
      .innerText = vacinas.length;

    // ATRASADAS

    const responseVacinacoes =
      await fetch(`${API}/vacinacoes`);

    const vacinacoes =
      await responseVacinacoes.json();

    const atrasadas =
      vacinacoes.filter(v =>
        v.status === 'Atrasada'
      );

    document
      .getElementById('vacinasAtrasadas')
      .innerText = atrasadas.length;

    // PRÓXIMAS

    const hoje = new Date();

    const proximas =
      vacinacoes.filter(v => {
        if (!v.proxima_dose)
          return false;

        const data =
          new Date(v.proxima_dose);

        const diferenca =
          (data - hoje) /
          (1000 * 60 * 60 * 24);

        return diferenca >= 0 &&
          diferenca <= 7;
      });

    document
      .getElementById('proximasVacinas')
      .innerText = proximas.length;

  } catch (erro) {
    console.log(erro);
  }

}

// ENVIAR EMAIL

async function enviarEmail() {
  const dados = {
    email:
      document.getElementById('emailResponsavel').value,

    nomeCrianca:
      document.getElementById('nomeCriancaEmail').value,

    vacina:
      document.getElementById('vacinaEmail').value,

    data:
      document.getElementById('dataVacina').value

  };

  if (
    !dados.email ||
    !dados.nomeCrianca ||
    !dados.vacina ||
    !dados.data
  ) {

    alert('Preencha todos os campos');
    return;

  }

  try {
    const response =
      await fetch(`${API}/enviar-email`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)

      });

    const resultado =
      await response.json();

    if (resultado.erro) {

      alert(resultado.erro);
      return;
    }

    alert(resultado.mensagem);

  } catch (erro) {

    console.log(erro);

    alert('Erro ao enviar email');

  }

}

// NOTIFICAÇÕES AUTOMÁTICAS

async function carregarNotificacoes() {

  try {

    const response =
      await fetch(`${API}/vacinacoes`);

    const vacinacoes =
      await response.json();

    const container =
      document.getElementById('notificacoes');

    container.innerHTML = `

            <h2 class="title">
                Notificações
            </h2>

        `;

    if (vacinacoes.length === 0) {

      container.innerHTML += `

                <div class="alerta">
                    Nenhuma notificação encontrada.
                </div>

            `;

      return;

    }

    vacinacoes.forEach(v => {

      let mensagem = '';

      if (
        v.status &&
        v.status.toLowerCase() === 'pendente'
      ) {

        mensagem = `
                    ⚠️ ${v.crianca}
                    deve tomar a vacina
                    ${v.vacina}
                    em breve.
                `;

      } else if (
        v.status &&
        v.status.toLowerCase() === 'atrasada'
      ) {

        mensagem = `
                    ⚠️ ${v.crianca}
                    está com a vacina
                    ${v.vacina}
                    atrasada.
                `;

      } else {

        mensagem = `
                    ✅ ${v.crianca}
                    tomou a vacina
                    ${v.vacina}.
                `;

      }

      container.innerHTML += `

                <div class="alerta">
                    ${mensagem}
                </div>

            `;

    });

  } catch (erro) {

    console.log(erro);

  }

}


// LOGOUT

function sair() {

  localStorage.removeItem('logado');

  location.reload();

}

// FORM VACINA

document
  .getElementById('formVacina')
  .addEventListener('submit', (e) => {

    e.preventDefault();

    cadastrarVacina();

  });
