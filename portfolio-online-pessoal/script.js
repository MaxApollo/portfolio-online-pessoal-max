/* ============================================================
   PORTFÓLIO – MAX APOLLO DOS SANTOS SALES
   Arquivo: script.js
   Disciplina: Fundamentos da Programação Web – UNINTER
   Descrição: Todas as interações e validações do portfólio
              sem uso de frameworks ou bibliotecas externas
   ============================================================ */

// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. MENU MOBILE – HAMBURGUER
     Alterna a classe 'aberto' no menu de navegação ao clicar
     no botão de três barras (hamburguer).
  ============================================================ */
  const btnMenu  = document.getElementById('btn-menu');
  const menuNav  = document.getElementById('menu-nav');

  btnMenu.addEventListener('click', function () {
    // Alterna a classe 'aberto' para mostrar/esconder o menu
    menuNav.classList.toggle('aberto');
  });

  // Fecha o menu mobile ao clicar em qualquer link do menu
  const navItens = document.querySelectorAll('.nav-item');
  navItens.forEach(function (item) {
    item.addEventListener('click', function () {
      menuNav.classList.remove('aberto');
    });
  });


  /* ============================================================
     2. ALTERNAR TEMA CLARO / ESCURO
     Modifica a classe do <body> entre 'tema-escuro' e 'tema-claro'.
     O emoji do botão também muda para refletir o estado atual.
  ============================================================ */
  const btnTema = document.getElementById('btn-tema');
  const corpo   = document.body;

  btnTema.addEventListener('click', function () {
    if (corpo.classList.contains('tema-escuro')) {
      // Muda para tema claro
      corpo.classList.replace('tema-escuro', 'tema-claro');
      btnTema.textContent = '🌞';  // Sol = modo claro ativo
    } else {
      // Volta para tema escuro
      corpo.classList.replace('tema-claro', 'tema-escuro');
      btnTema.textContent = '🌙';  // Lua = modo escuro ativo
    }
  });


  /* ============================================================
     3. DESTAQUE ATIVO NO MENU CONFORME ROLAGEM
     Usa IntersectionObserver para detectar qual seção está
     visível e aplicar a classe 'ativo' no link correspondente.
  ============================================================ */
  const secoes = document.querySelectorAll('.secao');

  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          // Remove a classe 'ativo' de todos os itens do menu
          navItens.forEach(function (item) {
            item.classList.remove('ativo');
          });

          // Adiciona 'ativo' no item correspondente à seção visível
          const idSecao = entrada.target.getAttribute('id');
          const navAtivo = document.querySelector('.nav-item[data-secao="' + idSecao + '"]');
          if (navAtivo) {
            navAtivo.classList.add('ativo');
          }
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' } // Seção considerada visível quando está no centro
  );

  // Observa cada seção da página
  secoes.forEach(function (secao) {
    observador.observe(secao);
  });


  /* ============================================================
     4. ANIMAÇÃO DAS BARRAS DE PROGRESSO (SEÇÃO FORMAÇÃO)
     Quando as barras de progresso entram na viewport,
     a largura é animada de 0% até o valor definido em
     data-progresso via CSS transition.
  ============================================================ */
  const barras = document.querySelectorAll('.barra-progresso');

  const observadorBarras = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          // Lê o valor do atributo data-progresso e aplica como largura
          const progresso = entrada.target.getAttribute('data-progresso');
          entrada.target.style.width = progresso + '%';
          // Para de observar depois de animar (só anima uma vez)
          observadorBarras.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  barras.forEach(function (barra) {
    observadorBarras.observe(barra);
  });


  /* ============================================================
     5. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
     Valida os campos nome, e-mail e mensagem antes do envio.
     Exibe mensagens de erro inline e, se válido, abre o modal
     de confirmação e limpa o formulário.
  ============================================================ */
  const formContato  = document.getElementById('form-contato');
  const campoNome    = document.getElementById('nome');
  const campoEmail   = document.getElementById('email');
  const campoMensagem = document.getElementById('mensagem');

  // Referências para as mensagens de erro de cada campo
  const erroNome     = document.getElementById('erro-nome');
  const erroEmail    = document.getElementById('erro-email');
  const erroMensagem = document.getElementById('erro-mensagem');

  /**
   * Valida um campo individualmente.
   * @param {HTMLElement} campo - O input ou textarea a validar
   * @param {HTMLElement} erroEl - O elemento onde exibir a mensagem de erro
   * @param {string}      mensagemErro - Texto do erro a exibir
   * @param {Function}    condicao - Função que retorna true se o campo for inválido
   * @returns {boolean} true se o campo for válido
   */
  function validarCampo(campo, erroEl, mensagemErro, condicao) {
    if (condicao()) {
      // Campo inválido: exibe erro e adiciona classe visual
      campo.classList.add('invalido');
      erroEl.textContent = mensagemErro;
      return false;
    } else {
      // Campo válido: remove erro
      campo.classList.remove('invalido');
      erroEl.textContent = '';
      return true;
    }
  }

  /**
   * Verifica se o e-mail tem formato válido usando expressão regular.
   * Aceita o padrão: usuario@dominio.com
   */
  function emailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validação em tempo real (ao sair do campo)
  campoNome.addEventListener('blur', function () {
    validarCampo(campoNome, erroNome, 'Por favor, informe seu nome.', function () {
      return campoNome.value.trim() === '';
    });
  });

  campoEmail.addEventListener('blur', function () {
    if (campoEmail.value.trim() === '') {
      validarCampo(campoEmail, erroEmail, 'Por favor, informe seu e-mail.', function () { return true; });
    } else {
      validarCampo(campoEmail, erroEmail, 'Informe um e-mail válido (ex: usuario@dominio.com).', function () {
        return !emailValido(campoEmail.value.trim());
      });
    }
  });

  campoMensagem.addEventListener('blur', function () {
    validarCampo(campoMensagem, erroMensagem, 'Por favor, escreva sua mensagem.', function () {
      return campoMensagem.value.trim() === '';
    });
  });

  // Validação ao submeter o formulário
  formContato.addEventListener('submit', function (evento) {
    // Impede o envio padrão do formulário (que recarregaria a página)
    evento.preventDefault();

    // Valida todos os campos e armazena os resultados
    const nomeOk     = validarCampo(campoNome, erroNome, 'Por favor, informe seu nome.', function () {
      return campoNome.value.trim() === '';
    });

    const emailOk    = validarCampo(campoEmail, erroEmail,
      campoEmail.value.trim() === '' ? 'Por favor, informe seu e-mail.' : 'Informe um e-mail válido (ex: usuario@dominio.com).',
      function () {
        return campoEmail.value.trim() === '' || !emailValido(campoEmail.value.trim());
      }
    );

    const mensagemOk = validarCampo(campoMensagem, erroMensagem, 'Por favor, escreva sua mensagem.', function () {
      return campoMensagem.value.trim() === '';
    });

    // Só prossegue se todos os campos forem válidos
    if (nomeOk && emailOk && mensagemOk) {
      // Limpa os campos do formulário após o envio bem-sucedido
      formContato.reset();

      // Abre o modal de confirmação
      abrirModal();
    } else {
      // Foca no primeiro campo inválido para facilitar a correção
      if (!nomeOk)     campoNome.focus();
      else if (!emailOk)    campoEmail.focus();
      else if (!mensagemOk) campoMensagem.focus();
    }
  });


  /* ============================================================
     6. MODAL DE CONFIRMAÇÃO DE ENVIO
     Exibe e fecha o modal após o envio bem-sucedido do formulário.
  ============================================================ */
  const modal          = document.getElementById('modal-sucesso');
  const btnFecharModal = document.getElementById('btn-fechar-modal');

  // Função para abrir o modal (adiciona classe 'aberto')
  function abrirModal() {
    modal.classList.add('aberto');
    // Move o foco para o botão de fechar (acessibilidade)
    btnFecharModal.focus();
  }

  // Fechar o modal ao clicar no botão "Fechar"
  btnFecharModal.addEventListener('click', function () {
    modal.classList.remove('aberto');
  });

  // Fechar o modal ao clicar fora da caixa (no fundo escuro)
  modal.addEventListener('click', function (evento) {
    if (evento.target === modal) {
      modal.classList.remove('aberto');
    }
  });

  // Fechar o modal com a tecla Escape (acessibilidade)
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && modal.classList.contains('aberto')) {
      modal.classList.remove('aberto');
    }
  });

}); // Fim do DOMContentLoaded
