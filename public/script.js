let proximoIdLocal = 101;

async function buscarPosts() {
    const postsContainer = document.getElementById('posts');

    postsContainer.innerHTML = '<p>Carregando posts...</p>';

    try {
        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/posts?_limit=5'
        );

        const posts = response.data;

        postsContainer.innerHTML = '';

        posts.forEach((post) => {
            postsContainer.innerHTML += `
                <div id="post-${post.id}">
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error('Erro ao buscar os posts:', error);

        postsContainer.innerHTML =
            '<p>Não foi possível carregar os posts. Tente novamente mais tarde.</p>';
    }
}


async function criarPost(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const corpo = document.getElementById('corpo').value;
    const mensagem = document.getElementById('mensagem');
    const botaoEnviar = document.getElementById('botao-enviar');
    const postsContainer = document.getElementById('posts');

    mensagem.textContent = 'Enviando post...';
    botaoEnviar.disabled = true;

    try {
        const response = await axios.post(
            'https://jsonplaceholder.typicode.com/posts',
            {
                title: titulo,
                body: corpo,
                userId: 1,
                id:1
            }
        );

        const novoPost = {
            ...response.data,
            id: proximoIdLocal
        };

        proximoIdLocal++;

        postsContainer.innerHTML += `
            <div id="post-${novoPost.id}">
                <h2>${novoPost.title}</h2>
                <p>${novoPost.body}</p>
            </div>
        `;

        mensagem.textContent = 'Post criado com sucesso!';

        document.getElementById('post-form').reset();

    } catch (error) {
        console.error('Erro ao criar o post:', error);

        mensagem.textContent =
            'Não foi possível enviar o post. Tente novamente.'
    } finally {
        botaoEnviar.disabled = false;
    }
}

async function editarPost(event) {
    event.preventDefault();

    const id = document.getElementById('patch-id').value;
    const novoTitulo = document.getElementById('patch-titulo').value;

    const mensagem = document.getElementById('mensagem-patch');
    const botaoEditar = document.getElementById('botao-editar');

    mensagem.textContent = 'Editando post...';
    botaoEditar.disabled = true;

    try {
        const response = await axios.patch(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
            {
                title: novoTitulo
            }
        );

        console.log(response.data);

        const postNaTela = document.getElementById(`post-${id}`);

        if (postNaTela) {
            const tituloNaTela = postNaTela.querySelector('h2');

            tituloNaTela.textContent = response.data.title;
        }

        mensagem.textContent = 'Post editado com sucesso!';

        document.getElementById('patch-form').reset();

    } catch (error) {
        console.error('Erro ao editar o post:', error);

        mensagem.textContent =
            'Não foi possível editar o post. Tente novamente.';

    } finally {
        botaoEditar.disabled = false;
    }
}

async function excluirPost(event) {
    event.preventDefault();

    const id = document.getElementById('delete-id').value;

    const mensagem = document.getElementById('mensagem-delete');
    const botaoExcluir = document.getElementById('botao-excluir');

    mensagem.textContent = 'Excluindo post...';
    botaoExcluir.disabled = true;

    try {

        if (id <= 100) {
            await axios.delete(
                `https://jsonplaceholder.typicode.com/posts/${id}`
            );
        }

        const postNaTela = document.getElementById(`post-${id}`);

        if (postNaTela) {
            postNaTela.remove();

            mensagem.textContent = 'Post excluído com sucesso!';
        } else {
            mensagem.textContent = 'Post não encontrado na tela.';
        }

        document.getElementById('delete-form').reset();

    } catch (error) {
        console.error('Erro ao excluir o post:', error);

        mensagem.textContent =
            'Não foi possível excluir o post. Tente novamente.';

    } finally {
        botaoExcluir.disabled = false;
    }
}

buscarPosts();

const formulario = document.getElementById('post-form');
formulario.addEventListener('submit', criarPost);

const formularioPatch = document.getElementById('patch-form');
formularioPatch.addEventListener('submit', editarPost);

const formularioDelete = document.getElementById('delete-form');
formularioDelete.addEventListener('submit', excluirPost);