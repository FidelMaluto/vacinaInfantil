function entrar(){

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if(email === '' || senha === ''){

    alert('Preencha todos os campos!');

    return;
  }

  document.getElementById('loginPage').style.display = 'none';

  document.getElementById('sistema').classList.remove('hidden');

  alert('Login realizado com sucesso!');

}
