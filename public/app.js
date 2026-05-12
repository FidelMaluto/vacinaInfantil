// URL DA API

const API = 'http://localhost:3000';

// CADASTRAR USUÁRIO

async function cadastrarUsuario() {
  const dados = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    senha: document.getElementById('senha').value,
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

// CADASTRAR CRIANÇA

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

  } catch (erro) {
    console.log(erro);
    alert('Erro ao cadastrar criança');
  }
}

// LISTAR VACINAS

async function listarVacinas() {
  try {
    const response = await fetch(`${API}/vacinas`);
    const vacinas = await response.json();
    const container = document.getElementById('listaVacinas');

    container.innerHTML = '';
    vacinas.forEach(vacina => {
      container.innerHTML += `
            
                <div class="vacina-card">

                    <img src="${vacina.imagem}" width="100%">

                    <div class="vacina-info">

                        <h3>${vacina.nome}</h3>

                        <p>
                            ${vacina.descricao}
                        </p>

                        <p>
                            <strong>Idade:</strong>
                            ${vacina.idade_recomendada}
                        </p>

                        <p>
                            <strong>Cuidados:</strong>
                            ${vacina.cuidados}
                        </p>

                    </div>

                </div> `;
    });

  } catch (erro) {
    console.log(erro);
  }
}

// REGISTRAR VACINAÇÃO

async function registrarVacinacao() {
  const dados = {
    crianca_id: document.getElementById('crianca_id').value,
    vacina_id: document.getElementById('vacina_id').value,
    data_aplicacao: document.getElementById('data_aplicacao').value,
    proxima_dose: document.getElementById('proxima_dose').value
  };

  try {
    const response = await fetch(`${API}/vacinacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)

    });

    const resultado = await response.json();

    alert(resultado.mensagem);

  } catch (erro) {
    console.log(erro);
    alert('Erro ao registrar vacinação');
  }
}

// ENVIAR EMAIL

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

// LISTAR CRIANÇAS

async function listarCriancas() {
  try {
    const response = await fetch(`${API}/criancas`);
    const criancas = await response.json();
    const container = document.getElementById('listaCriancas');

    container.innerHTML = '';
    criancas.forEach(crianca => {
      container.innerHTML += `
                <div class="card">

                    <h3>
                        👶 ${crianca.nome}
                    </h3>

                    <p>
                        Responsável:
                        ${crianca.responsavel}
                    </p>

                    <p>
                        Sexo:
                        ${crianca.sexo}
                    </p>

                    <p>
                        Nascimento:
                        ${crianca.nascimento}
                    </p>

                </div> `;
    });

  } catch (erro) {
    console.log(erro);
  }
}

// CARREGAR AUTOMATICAMENTE

listarVacinas();

listarCriancas();
